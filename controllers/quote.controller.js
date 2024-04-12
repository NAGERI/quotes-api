import prisma from "@prisma/client"


const getQuotes = async (req,res) => {
  // const quotes = await prisma.quote
  res.send("All Quotes")
}

export   {getQuotes}