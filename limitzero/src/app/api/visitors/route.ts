import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactName, email, country, age } = body

    if (!contactName || !email || !country || !age) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const visitor = await prisma.visitor.create({
      data: {
        contactName,
        email,
        country,
        age: parseInt(age),
      },
    })

    return NextResponse.json({ 
      message: 'Visitor information saved successfully',
      visitor: {
        id: visitor.id,
        contactName: visitor.contactName,
        email: visitor.email,
        country: visitor.country,
        age: visitor.age,
        createdAt: visitor.createdAt
      }
    })
  } catch (error) {
    console.error('Error saving visitor:', error)
    return NextResponse.json(
      { error: 'Failed to save visitor information' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ visitors })
  } catch (error) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visitors' },
      { status: 500 }
    )
  }
}