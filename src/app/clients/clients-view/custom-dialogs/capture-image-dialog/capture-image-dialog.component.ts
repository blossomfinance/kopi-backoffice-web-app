/** Angular Imports */
import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Capture image dialog component
 */
@Component({
  selector: 'mifosx-capture-image-dialog',
  templateUrl: './capture-image-dialog.component.html',
  styleUrls: ['./capture-image-dialog.component.scss']
})
export class CaptureImageDialogComponent implements AfterViewInit, OnDestroy {

  /** Video element reference */
  @ViewChild('video', { static: true }) video: ElementRef;
  /** Canvas element reference */
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  /** Fallback element reference */
  @ViewChild('fallback', { static: true }) fallback: ElementRef;
  /** Capture button element reference */
  @ViewChild('captureButton') captureButton: ElementRef;

  /** Toggles button states */
  isCaptured = false;
  /** Client image file */
  clientImageDataURL: string;
  /** Client image file */
  videoStream: object;

  /**
   * @param {MatDialogRef} dialogRef Mat Dialog Reference
   * @param {Renderer2} renderer Template Renderer
   */
  constructor(public dialogRef: MatDialogRef<CaptureImageDialogComponent>,
    private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  selectCamera(deviceInfos: Array<any>) {
    const videoSelect = document.querySelector('select#videoSource');
    if (navigator.mediaDevices) {
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || `camera ${i + 1}`;
          videoSelect.appendChild(option);
          console.debug('Camera ' + i, deviceInfo);
        } else {
          console.log('This is not recognized as a video device', deviceInfo);
        }
      }
    } else {
      throw new Error('No media devices is detected');
    }
  }

  /**
   * Initializes camera video stream once user grants permission.
   * facingMode : "environment" will prefer the rear camera if available.
   * Sets fallback if permission not granted.
   * See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices for configuration details.
   */
  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices().then(this.selectCamera).catch(this.handleError);
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: 1920,
          height: 1080
        }
      })
        .then((stream: MediaStream) => {
          this.renderer.setProperty(this.video.nativeElement, 'srcObject', stream);
          this.video.nativeElement.play();
        })
        .catch((error: Error) => {
          this.handleError(error);
        });
    } else {
      throw new Error('Cannot connect to camera');
    }
  }

  /**
   * Shows fallback message.
   * @param {Error} error Error
   */
  handleError(error: Error) {
    this.renderer.removeStyle(this.fallback.nativeElement, 'display');
    const fallbackMessage = this.renderer.createText(`${error.name}: ${error.message}`);
    this.renderer.appendChild(this.fallback.nativeElement, fallbackMessage);
    this.renderer.setStyle(this.video.nativeElement, 'display', 'none');
    this.renderer.setProperty(this.captureButton, 'disabled', 'true');
  }

  /**
   * Stops video stream and closes the camera.
   * See https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack for `MediaStreamTrack` properties.
   */
  stopCamera() {
    const stream: MediaStream = this.video.nativeElement.srcObject;
    if (stream) {
      const videoStream: MediaStreamTrack = stream.getTracks()[0];
      videoStream.stop();
    }
    this.renderer.setProperty(this.video.nativeElement, 'srcObject', null);
  }

  /**
   * Captures the image by drawing video state on canvas, then converts canvas state to data URL.
   * See https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL for details.
   */
  capture() {
    this.isCaptured = true;
    this.video.nativeElement.pause();
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 150, 150);
    this.clientImageDataURL = this.canvas.nativeElement.toDataURL();
  }

  /**
   * Allows user to capture image again.
   */
  recapture() {
    this.isCaptured = false;
    this.video.nativeElement.play();
  }

}
