import { prisma } from '../prisma'

describe('Prisma Client', () => {
  it('exports a prisma client instance', () => {
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  it('has visitor model methods', () => {
    expect(prisma.visitor).toBeDefined()
    expect(typeof prisma.visitor.create).toBe('function')
    expect(typeof prisma.visitor.findMany).toBe('function')
    expect(typeof prisma.visitor.findUnique).toBe('function')
    expect(typeof prisma.visitor.update).toBe('function')
    expect(typeof prisma.visitor.delete).toBe('function')
  })

  it('has connection methods', () => {
    expect(typeof prisma.$connect).toBe('function')
    expect(typeof prisma.$disconnect).toBe('function')
  })

  it('has transaction methods', () => {
    expect(typeof prisma.$transaction).toBe('function')
  })

  it('has query methods', () => {
    expect(typeof prisma.$queryRaw).toBe('function')
    expect(typeof prisma.$executeRaw).toBe('function')
  })
})