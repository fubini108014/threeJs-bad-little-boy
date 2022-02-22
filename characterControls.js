import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const up = 'arrowup';
const down = 'arrowdown';
const left = 'arrowleft';
const right = 'arrowright';
const DIRECTIONS = [up, left, down, right];

export class CharacterControls {
  // state
  toggleRun = true;
  // temporary data
  walkDirection = new THREE.Vector3();
  rotateAngle = new THREE.Vector3(0, 1, 0);
  rotateQuarternion = new THREE.Quaternion();
  cameraTarget = new THREE.Vector3();

  // constants
  fadeDuration = 0.2;
  runVelocity = 5;
  walkVelocity = 2;

  constructor(
    model,
    mixer,
    animationsMap,
    orbitControl,
    camera,
    currentAction
  ) {
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap;
    this.currentAction = currentAction;
    this.animationsMap.forEach((value, key) => {
      if (key == currentAction) {
        value.play();
      }
    });
    this.orbitControl = orbitControl;
    this.camera = camera;
    this.updateCameraTarget(0, 0);
  }

  switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }

  update(delta, keysPressed, mouseMove) {
    const directionPressed = DIRECTIONS.some((key) => keysPressed[key] == true);

    var play = '';
    if (directionPressed && this.toggleRun) {
      play = 'course_chapeau';
    } else if (directionPressed || mouseMove.isMouseClick) {
      play = 'course_chapeau';
    } else {
      play = 'pose_chapeau';
    }

    if (this.currentAction != play) {
      const toPlay = this.animationsMap.get(play);
      const current = this.animationsMap.get(this.currentAction);

      current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = play;
    }

    this.mixer.update(delta);

    //滑鼠與物件的距離
    if (mouseMove.isMouseClick) {
      var currDist = this.model.position.manhattanDistanceTo(mouseMove.vector);
      if (currDist <= 0.3) {
        mouseMove.isMouseClick = false;
      }
    }

    if (this.currentAction == 'course_chapeau') {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );
      // diagonal movement angle offset
      var directionOffset = mouseMove.isMouseClick
        ? mouseMove.angle
        : this.directionOffset(keysPressed);
      //var directionOffset = this.directionOffset(keysPressed);

      // rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset + Math.PI
      );

      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk velocity
      const velocity =
        this.currentAction == 'course_chapeau'
          ? this.runVelocity
          : this.walkVelocity;

      // move model & camera
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
  }

  updateCameraTarget(moveX, moveZ) {
    // move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // update camera target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
  }

  directionOffset(keysPressed) {
    var directionOffset = 0; // w

    if (keysPressed[up]) {
      if (keysPressed[left]) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed[right]) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed[down]) {
      if (keysPressed[left]) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed[right]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed[left]) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed[right]) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }
}
