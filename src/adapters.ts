import {Lenti} from "./index.ts"
import {clamp, remap} from "./utils.ts"
/**
 * UI Adapaters listen for events on a page and can access Lenti properties throughout the instance lifecycle.
 * UIAdapters expect a Lenti instance to be passed to them, and can be used to bind user input to shader settings.
 * In practice, this can be as simple as:
 * ```ts
 * // Sets the lensDarkening based on the amount of daylight when the page loads
 * new Lenti({uiAdapters: [function bindDaylight(lentiInstance: Lenti) => {
 *   lentiInstance.inputs.lensDarkening = 0.5
 * })]})
 * ```
 * If you want your UIAdapter to be reusable and configurable, you can create a UIAdapterFactory that returns the UIAdapter.
 * ```ts
 * // Sets the lensDarkening based on the amount of daylight when the page loads
 * const bindDaylightFactory = (options: {daylight: number}) => {
 *   return function bindDaylight(lentiInstance: Lenti) => {
 *     lentiInstance.inputs.lensDarkening = 1 - options.daylight
 *   }
 * }
 *
 * new Lenti({uiAdapters: [bindDaylightFactory({daylight: 0.5})]})
 * ```
 *
*/
export type UIAdapter = (lentiInstance: Lenti) => void;
/** UIAdapterFactory is an initializing function that is passed options for the UIAdapater it contains. */
export type UIAdapterFactory = (options?: any) => UIAdapter;

/**
 * Drives viewX/viewY based on the device viewing angle
 * @group UI Adapters
 */
export const bindGyroscopeXY = (options: {
  /** changes x values */
  xBounds: [number, number],
  /** changes y values */
  yBounds: [number, number],
  /** when the deviceorientation listener is initiated, measure values against the start */
  relative?: boolean,
  /** Some browsers require user gesture before requesting permission. This is the element that will require click if so. */
  userGestureElement?: HTMLElement,
} = {xBounds: [-45, 45], yBounds: [0,90]}): UIAdapter => {
  const degtorad = Math.PI / 180; // Degree-to-Radian conversion
  /** https://www.w3.org/TR/orientation-event/ */
  const getRotationMatrix = ( alpha, beta, gamma ) => {
    var _x = beta  ? beta  * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value
    var cX = Math.cos( _x );
    var cY = Math.cos( _y );
    var cZ = Math.cos( _z );
    var sX = Math.sin( _x );
    var sY = Math.sin( _y );
    var sZ = Math.sin( _z );
    //
    // ZXY rotation matrix construction.
    //
    var m11 = cZ * cY - sZ * sX * sY;
    var m12 = - cX * sZ;
    var m13 = cY * sZ * sX + cZ * sY;

    var m21 = cY * sZ + cZ * sX * sY;
    var m22 = cZ * cX;
    var m23 = sZ * sY - cZ * cY * sX;

    var m31 = - cX * sY;
    var m32 = sX;
    var m33 = cX * cY;

    return [
      m11,    m12,    m13,
      m21,    m22,    m23,
      m31,    m32,    m33
    ];
  };
  return (lentiInstance: Lenti) => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const matrix = getRotationMatrix(e.alpha, e.beta, e.gamma);
      const viewX = clamp(
        remap(matrix[2], [options.xBounds[0] / 90, options.xBounds[1] / 90], [0, 1]),
        0, 1
      );
      const viewY = clamp(
        remap(matrix[7], [options.yBounds[0] / 90, options.yBounds[1] / 90], [0, 1]),
        0, 1
      );
      lentiInstance.inputs.viewX = viewX
      lentiInstance.inputs.viewY = viewY
      lentiInstance.render()
    }

    const userGestureBindingElement = options.userGestureElement ?? lentiInstance.canvas
    if ("requestPermission" in DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      userGestureBindingElement?.addEventListener('click', (e) => {
        if ("requestPermission" in DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
          DeviceOrientationEvent.requestPermission()
            .then((response) => {
              if (response === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
              }
            })
            .catch(console.error);
        }
      });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }
}

/**
 * Drives viewX/viewY based on the mouse position on the element, in the browser window, or in another element (like a touchstrip element)
 * @group UI Adapters
 */
export const bindMouseXY = (options: {eventRoot?: HTMLElement | Window | Document | null } = {}): UIAdapter => {
  return (lentiInstance: Lenti) => {
    const root = options.eventRoot ?? lentiInstance.canvas
    if (!root) {
      lentiInstance.error(new Error("No event root element found"))
      return
    }
    const mouseHandler = (event) => {
      if (lentiInstance.canvas) {
        const rect = lentiInstance.canvas.getBoundingClientRect()
        const rawX = (event.clientX - rect.left) / rect.width
        const deadzone = 0.01 // 10% deadzone on each side

        let viewX: number;
        if (rawX < deadzone) {
          viewX = 0
        } else if (rawX > 1 - deadzone) {
          viewX = 1
        } else {
          // Remap remaining range to 0-1
          viewX = (rawX - deadzone) / (1 - 2 * deadzone)
        }
        const viewY = clamp(((event as MouseEvent).clientY - rect.top) / rect.height, 0, 1)
        lentiInstance.inputs.viewX = viewX
        lentiInstance.inputs.viewY = viewY
        lentiInstance.render()
      }
    }
    root.addEventListener("mousemove", mouseHandler)
  }
}
