class VideoService {
    public preview(video: Blob) {
        return {
            url: URL.createObjectURL(video)
        };
    }

    public save(video: Blob) {
        return {
            url: URL.createObjectURL(video)
        };
    }
}

export default new VideoService();