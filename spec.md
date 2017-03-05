### interaction
```
if device.hasGyroscope() {
  interact.by = tilt
} else {
  interact.by = mouseover
  // maybe use rebound or similar for this interaction
}
```
### note about cross-origin images
if images come from a different origin (domain), they must have a crossorigin="anonymous" attribute

### options
- toggle accelerometer listener
- toggle mouse listener
