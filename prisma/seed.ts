// prisma/seed.ts
import { PrismaClient, Role, ItemType, CopyStatus, ReservationStatus, InterLibraryStatus } from '../app/generated/prisma';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting fresh seed...");

  // Clear existing data (in correct order due to relations)
  await prisma.fine.deleteMany();
  await prisma.borrowing.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.itemCopy.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.item.deleteMany();
  await prisma.readingChallenge.deleteMany();
  await prisma.interLibraryRequest.deleteMany();
  await prisma.roleConfig.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@libsys.com',
        password: 'hashed_admin_pass',
        role: Role.ADMIN,
        branch: 'Main',
        createdAt: new Date()
      },
      {
        name: 'Librarian',
        email: 'librarian@libsys.com',
        password: 'hashed_librarian_pass',
        role: Role.LIBRARIAN,
        branch: 'East Wing',
        createdAt: new Date()
      },
      {
        name: 'John Doe',
        email: 'john@student.com',
        password: 'hashed_password_123',
        role: Role.STUDENT,
        branch: 'Science',
        createdAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: 'hashed_password_456',
        role: Role.STUDENT,
        branch: 'Arts',
        createdAt: new Date()
      }
    ]
  });

  const john = await prisma.user.findUnique({ where: { email: 'john@student.com' } });
  const jane = await prisma.user.findUnique({ where: { email: 'jane@student.com' } });

  // Seed Items (Books)
  const book1 = await prisma.item.create({
    data: {
      title: 'Clean Code',
      type: ItemType.BOOK,
      author: 'Robert C. Martin',
      publisher: 'Prentice Hall',
      isbn: '9780132350884',
      description: 'A handbook of Agile software craftsmanship',
      coverImage: '',
      price: 45.99,
      category: 'Programming',
      tags: ['agile', 'clean', 'refactoring'],
      createdAt: new Date()
    }
  });

  const book2 = await prisma.item.create({
    data: {
      title: 'Atomic Habits',
      type: ItemType.BOOK,
      author: 'James Clear',
      publisher: 'Penguin',
      isbn: '9780735211292',
      description: 'Tiny changes, remarkable results.',
      coverImage: '',
      price: 19.99,
      category: 'Self Help',
      tags: ['habits', 'productivity'],
      createdAt: new Date()
    }
  });

  // Seed Copies
  const copy1 = await prisma.itemCopy.create({
    data: {
      itemId: book1.id,
      branch: 'Main',
      location: 'Shelf A',
      status: CopyStatus.AVAILABLE
    }
  });

  const copy2 = await prisma.itemCopy.create({
    data: {
      itemId: book2.id,
      branch: 'East Wing',
      location: 'Shelf B',
      status: CopyStatus.BORROWED
    }
  });

  // Seed Borrowing
  await prisma.borrowing.create({
    data: {
      userId: john!.id,
      itemCopyId: copy2.id,
      borrowedAt: new Date('2024-06-20'),
      dueDate: new Date('2024-07-05'),
      returnedAt: null,
      autoExtended: true
    }
  });

  // Seed Reviews
  await prisma.review.create({
    data: {
      userId: jane!.id,
      itemId: book2.id,
      rating: 5,
      comment: 'Life-changing book!',
      createdAt: new Date()
    }
  });

  // Seed Role Configs
  await prisma.roleConfig.createMany({
    data: [
      { role: Role.ADMIN, borrowLimit: 50, borrowDurationDays: 60, seasonalOverride: true },
      { role: Role.LIBRARIAN, borrowLimit: 20, borrowDurationDays: 30, seasonalOverride: true },
      { role: Role.STUDENT, borrowLimit: 5, borrowDurationDays: 15, seasonalOverride: false },
    ]
  });

  // Seed InterLibrary Request
  await prisma.interLibraryRequest.create({
    data: {
      requesterId: john!.id,
      sourceBranch: 'East Wing',
      targetBranch: 'Main',
      itemTitle: 'Atomic Habits',
      status: InterLibraryStatus.PENDING,
      createdAt: new Date()
    }
  });

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
