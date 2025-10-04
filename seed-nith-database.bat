@echo off
echo ===============================================
echo     StudentsPark - NIT Hamirpur Database Setup
echo ===============================================
echo.

echo Seeding database with NIT Hamirpur placement reviews...
cd backend
node seedNITHamirpur.js seed
cd ..

echo.
echo Database seeded successfully!
pause