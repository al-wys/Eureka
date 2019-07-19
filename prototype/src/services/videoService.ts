class VideoService {
    public save(video: Blob) {
        return {
            url: URL.createObjectURL(video)
        };
    }
}

export default new VideoService();