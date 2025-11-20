import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { students } = await request.json()

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { error: 'Geçersiz veri formatı' },
        { status: 400 }
      )
    }

    console.log(`📊 Toplu yükleme başladı: ${students.length} öğrenci`)

    // Validate all students have required fields
    const invalidStudents = students.filter(
      (s: any) => !s.fullName || !s.className
    )

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        { error: 'Tüm öğrenciler için ad soyad ve sınıf gereklidir' },
        { status: 400 }
      )
    }

    // Fetch all classes to map names to IDs
    const { data: classes } = await supabase
      .from('classes')
      .select('id, name')
    
    const classMap = new Map(classes?.map(c => [c.name, c.id]) || [])

    // Collect unique parent emails and their data
    const parentMap = new Map<string, any>()
    const errors: string[] = []

    students.forEach((student: any) => {
      if (student.motherName || student.fatherName) {
        // Use mother's phone if available, otherwise father's, otherwise mother's name
        const primaryPhone = student.motherPhone || student.fatherPhone
        const primaryName = student.motherName || student.fatherName
        const parentEmail = primaryPhone 
          ? `${primaryPhone}@parent.local`
          : `${primaryName.replace(/\s+/g, '').toLowerCase()}@parent.local`
        
        if (!parentMap.has(parentEmail)) {
          parentMap.set(parentEmail, {
            full_name: primaryName,
            email: parentEmail,
            phone: primaryPhone || null,
            mother_name: student.motherName || null,
            mother_phone: student.motherPhone || null,
            father_name: student.fatherName || null,
            father_phone: student.fatherPhone || null
          })
        }
      }
    })

    console.log(`👨‍👩‍👧 Benzersiz veli sayısı: ${parentMap.size}`)

    // Batch insert parents
    const parentsToCreate = Array.from(parentMap.values())
    const createdParents = new Map<string, string>() // email -> id

    if (parentsToCreate.length > 0) {
      // Check existing parents
      const parentEmails = parentsToCreate.map(p => p.email)
      const { data: existingParents } = await supabase
        .from('parents')
        .select('id, email')
        .in('email', parentEmails)

      existingParents?.forEach(p => {
        createdParents.set(p.email, p.id)
      })

      // Filter out parents that already exist
      const newParents = parentsToCreate.filter(p => !createdParents.has(p.email))

      if (newParents.length > 0) {
        console.log(`➕ Yeni veli oluşturuluyor: ${newParents.length}`)
        
        // Insert new parents in batch
        const { data: insertedParents, error: parentError } = await supabase
          .from('parents')
          .insert(newParents)
          .select('id, email')

        if (parentError) {
          console.error('Toplu veli ekleme hatası:', parentError)
          return NextResponse.json(
            { error: `Veli kayıtları oluşturulamadı: ${parentError.message}` },
            { status: 500 }
          )
        }

        insertedParents?.forEach(p => {
          createdParents.set(p.email, p.id)
        })
      }
    }

    console.log(`✅ Toplam veli: ${createdParents.size}`)

    // Prepare student data for batch insert
    const studentsData = []
    
    for (const student of students) {
      const nameParts = student.fullName.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]

      const classId = classMap.get(student.className)
      if (!classId) {
        errors.push(`Sınıf bulunamadı: ${student.className} (${student.fullName})`)
        continue
      }

      let parentId = null
      if (student.motherName || student.fatherName) {
        const parentFullName = student.motherName || student.fatherName
        const parentPhone = student.motherPhone || student.fatherPhone
        const parentEmail = parentPhone 
          ? `${parentPhone}@parent.local`
          : `${parentFullName.replace(/\s+/g, '').toLowerCase()}@parent.local`
        
        parentId = createdParents.get(parentEmail) || null
      }

      studentsData.push({
        first_name: firstName,
        last_name: lastName,
        class_id: classId,
        parent_id: parentId
      })
    }

    console.log(`👨‍🎓 Öğrenci kaydediliyor: ${studentsData.length}`)

    // Batch insert students (in chunks of 100 to avoid payload limits)
    const CHUNK_SIZE = 100
    const insertedStudents = []

    for (let i = 0; i < studentsData.length; i += CHUNK_SIZE) {
      const chunk = studentsData.slice(i, i + CHUNK_SIZE)
      console.log(`📦 Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(studentsData.length / CHUNK_SIZE)}: ${chunk.length} öğrenci`)
      
      const { data, error } = await supabase
        .from('students')
        .insert(chunk)
        .select()

      if (error) {
        console.error(`Chunk ${i / CHUNK_SIZE + 1} hatası:`, error)
        errors.push(`Toplu kayıt hatası (${i}-${i + chunk.length}): ${error.message}`)
      } else if (data) {
        insertedStudents.push(...data)
      }
    }

    console.log(`✅ Tamamlandı! ${insertedStudents.length} öğrenci eklendi`)

    if (insertedStudents.length === 0) {
      return NextResponse.json(
        { error: 'Hiçbir öğrenci eklenemedi', details: errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: insertedStudents.length,
      totalParents: createdParents.size,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    console.error('❌ API Hatası:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + error.message },
      { status: 500 }
    )
  }
}
