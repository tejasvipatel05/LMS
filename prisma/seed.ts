import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  try {
    // Create Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@library.com' },
      update: {},
      create: {
        email: 'admin@library.com',
        password: await hashPassword('admin123'),
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+1-555-0001',
        address: '123 Admin Street, Library City'
      }
    })
    console.log('✅ Created Admin user:', adminUser.email)

    // Create Librarian User  
    const librarianUser = await prisma.user.upsert({
      where: { email: 'librarian@library.com' },
      update: {},
      create: {
        email: 'librarian@library.com',
        password: await hashPassword('lib123'),
        name: 'Librarian User',
        role: 'LIBRARIAN',
        phone: '+1-555-0002',
        address: '456 Librarian Avenue, Book Town'
      }
    })
    console.log('✅ Created Librarian user:', librarianUser.email)

    // Create Patron User
    const patronUser = await prisma.user.upsert({
      where: { email: 'patron@library.com' },
      update: {},
      create: {
        email: 'patron@library.com',
        password: await hashPassword('patron123'),
        name: 'Patron User', 
        role: 'PATRON',
        phone: '+1-555-0003',
        address: '789 Reader Road, Knowledge City'
      }
    })
    console.log('✅ Created Patron user:', patronUser.email)

    // Add some sample books
    console.log('📚 Adding sample books...')
    
    const book1 = await prisma.book.upsert({
      where: { isbn: '978-0134685991' },
      update: {},
      create: {
        title: 'Effective Java',
        author: 'Joshua Bloch',
        isbn: '978-0134685991',
        publisher: 'Addison-Wesley',
        publishedYear: 2017,
        category: 'Programming',
        description: 'The definitive guide to Java programming language best practices',
        totalCopies: 3,
        availableCopies: 3,
        status: 'AVAILABLE',
        location: 'A-101'
      }
    })

    const book2 = await prisma.book.upsert({
      where: { isbn: '978-0321125217' },
      update: {},
      create: {
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        isbn: '978-0321125217',
        publisher: 'Addison-Wesley',
        publishedYear: 2003,
        category: 'Software Architecture',
        description: 'Tackling complexity in the heart of software',
        totalCopies: 2,
        availableCopies: 2,
        status: 'AVAILABLE',
        location: 'B-205'
      }
    })

    const book3 = await prisma.book.upsert({
      where: { isbn: '978-0132350884' },
      update: {},
      create: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        category: 'Programming',
        description: 'A handbook of agile software craftsmanship',
        totalCopies: 4,
        availableCopies: 4,
        status: 'AVAILABLE',
        location: 'A-103'
      }
    })

    console.log('✅ Created books:', [book1.title, book2.title, book3.title])

    // Create some borrowing records
    console.log('📖 Adding sample borrowing records...')

    // Create an active borrowing (patron borrowed "Effective Java")
    const activeBorrowing = await prisma.borrowing.create({
      data: {
        bookId: book1.id, // Effective Java
        userId: patronUser.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 14 days
        status: 'ACTIVE'
      }
    })

    // Create an overdue borrowing
    const overdueBorrowing = await prisma.borrowing.create({
      data: {
        bookId: book2.id, // Domain-Driven Design
        userId: patronUser.id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Overdue by 5 days
        status: 'OVERDUE'
      }
    })

    // Update book availability
    await prisma.book.update({
      where: { id: book1.id },
      data: { availableCopies: 2 } // 3 total - 1 borrowed = 2 available
    })

    await prisma.book.update({
      where: { id: book2.id },
      data: { availableCopies: 1 } // 2 total - 1 borrowed = 1 available
    })

    console.log('✅ Created borrowing records')

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Demo Login Credentials:')
    console.log('Admin: admin@library.com / admin123')
    console.log('Librarian: librarian@library.com / lib123')
    console.log('Patron: patron@library.com / patron123')

    console.log('\n📊 Expected Dashboard Stats:')
    console.log('📚 Total Books: 3')
    console.log('👥 Total Users: 3') 
    console.log('📖 Books Issued: 2')
    console.log('⚠️ Overdue Books: 1')
    console.log('💰 Total Fines: $0')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })