import * as faceapi from 'face-api.js';

let initTask: Promise<void> | undefined;

class FaceDetecterHelper {
    public async init() {
        if (!initTask) {
            initTask = new Promise(async (resolve) => {
                await faceapi.nets.tinyFaceDetector.load('/weights');
                await faceapi.loadFaceLandmarkModel('/weights');

                resolve();
            });
        }

        await initTask;
    }

    public async drawFaceMark(video: HTMLVideoElement, canvas: HTMLCanvasElement, boxOnly?: boolean) {
        const res = await faceapi.detectSingleFace(video as any, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })).withFaceLandmarks();
        console.log(res);
        if (res) {
            const dims = faceapi.matchDimensions(canvas, video, true);
            const resizedRes = faceapi.resizeResults(res, dims);

            if (!boxOnly) {
                faceapi.draw.drawFaceLandmarks(canvas, resizedRes);
            }
            faceapi.draw.drawDetections(canvas, resizedRes);
        }
    }
}

export default new FaceDetecterHelper();