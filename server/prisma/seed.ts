import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { items } from '../../src/data/items';
import { lenders, currentUser } from '../../src/data/users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BorrowBuddy database seed...');

  // 1. Clean existing data
  await prisma.activity.deleteMany({});
  await prisma.borrowRequest.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 2. Seed Current User
  await prisma.user.create({
    data: {
      id: currentUser.id,
      name: currentUser.name,
      email: 'alex.moreau@univ.edu',
      passwordHash,
      initials: currentUser.initials,
      avatarColor: currentUser.avatarColor,
      course: currentUser.course,
      verifiedEmail: currentUser.verifiedEmail,
      profileVerified: currentUser.profileVerified,
      trustScore: currentUser.trustScore,
      onTimeReturnsCount: currentUser.onTimeReturns[0],
      totalReturnsCount: currentUser.onTimeReturns[1],
      avgConditionRating: currentUser.avgConditionRating,
      memberSince: currentUser.memberSince,
    },
  });

  // 3. Seed Lenders
  for (const lender of Object.values(lenders)) {
    const email = `${lender.name.toLowerCase().replace(/\s+/g, '.')}@univ.edu`;
    await prisma.user.create({
      data: {
        id: lender.id,
        name: lender.name,
        email,
        passwordHash,
        initials: lender.initials,
        avatarColor: lender.avatarColor,
        course: lender.course,
        verifiedEmail: lender.verifiedEmail,
        profileVerified: lender.profileVerified,
        trustScore: lender.trustScore,
        onTimeReturnsCount: lender.onTimeReturns[0],
        totalReturnsCount: lender.onTimeReturns[1],
        avgConditionRating: lender.avgConditionRating,
        memberSince: lender.memberSince,
      },
    });
  }

  console.log(`✅ Seeded ${Object.keys(lenders).length + 1} user profiles.`);

  // 4. Seed all 106 Items
  for (const item of items) {
    // Ensure lender exists, fallback to currentUser if not in lenders
    const lenderExists = item.lenderId in lenders || item.lenderId === currentUser.id;
    const finalLenderId = lenderExists ? item.lenderId : currentUser.id;

    await prisma.item.create({
      data: {
        id: item.id,
        name: item.name,
        category: item.category,
        condition: item.condition,
        description: item.description,
        rules: JSON.stringify(item.rules),
        campus: item.campus,
        distanceKm: item.distanceKm,
        maxDurationDays: item.maxDurationDays,
        suggestedDurationDays: item.suggestedDurationDays,
        depositEuros: item.depositEuros,
        available: item.available,
        availableFrom: item.availableFrom,
        pickupMethod: item.pickupMethod,
        rating: item.rating,
        borrowCount: item.borrowCount,
        imageSeed: item.imageSeed,
        lenderId: finalLenderId,
      },
    });
  }

  console.log(`✅ Seeded ${items.length} catalog items into SQLite database.`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
