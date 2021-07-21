/* global document */
import Lenti from '../index.js'
import { jsdom } from 'jsdom'

global.document = jsdom('<html><body></body></html>')
global.window = global

document.body.innerHTML = `
  <div data-lenticular-list="true" data-strip-width="8" data-tilt-min="-35" data-tilt-max="35">
    <img src="./images/1.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
    <img src="./images/2.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
    <img src="./images/3.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
    <img src="./images/4.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
  </div>
`

const el = document.querySelector('[data-lenticular-list]')

const testInstance = new Lenti({
  container: el,
  tiltMax: el.getAttribute('data-tilt-max'),
  tiltMin: el.getAttribute('data-tilt-min')
})

describe("Lenti", () => {
  it('instantiates properly', () => {
    expect(testInstance).toBeInstanceOf(Lenti)
  })
  it('initializes without error', () => {

    testInstance.init()
  })
})
describe("remap", () => {
  it('maps values from one range to another', () => {
    expect(testInstance.remap(5,    0, 10,   0, 100)).toEqual(50)
    expect(testInstance.remap(9,    0, 100,  0, 2)).toEqual(0.18)
    expect(testInstance.remap(7.5,  5, 10,   0, 2)).toEqual(1)
  });
})
