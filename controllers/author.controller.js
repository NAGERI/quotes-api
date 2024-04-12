import prisma from "@prisma/client"


const getAuthors = async (req,res) => {
  // const quotes = await prisma.quote
  res.send("All Authors")
}

export   {getAuthors}