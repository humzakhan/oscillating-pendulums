## Todo

- Compute positions in frontend using this source: https://editor.p5js.org/zygugi/sketches/SkGvzmnyf
- Once computed, send positions to the respective instance constantly over web socket
- upon receiving position, update the redis coordinates
- implement service to watch all 5 instance coordinates, and if there is an overlap, stop all instances
- implement stop signal in frontend and node instances