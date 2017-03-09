import Lenti from '../index.js'

const testInstance = new Lenti({ container: null })

describe("Lenti", () => {
  it('instantiates properly', () => {
    expect(testInstance).toBeInstanceOf(Lenti)
  })
})
describe("remap", () => {
  it('maps values from one range to another', () => {
    expect(testInstance.remap(5,    0, 10,   0, 100)).toEqual(50)
    expect(testInstance.remap(9,    0, 100,  0, 2)).toEqual(0.18)
    expect(testInstance.remap(7.5,  5, 10,   0, 2)).toEqual(1)
  });
})
