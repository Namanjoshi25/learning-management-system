const { PrismaClient } = require("@prisma/client");










const db = new PrismaClient();

async function main(){
    try {
        await db.category.createMany({
            data:[
                  {name : "Computer Science"},
                  {name : "Music"},
                  {name : "Fitness"},
                  {name : "Photography"},
                  {name : "Accounting"},
                  {name : "Engineering"},
                  {name : "Web developemnt"},
                  
            ]
        })
        console.log("success");
        
    } catch (error) {
        console.log('Error while seeding the database categories' , error);
    }finally{
        await  db.$disconnect();
    }
}

main();