import ContentService from "../service/content.service.js";

class ContentController {
    async getContentProfile(req, res, next) {
        try {
            const content = await ContentService.getContentProfile();
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async getContentUserClickTracking(req, res, next) {
        try {
            const content = await ContentService.getContentUserClickTracking();
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async getAllContent(req, res, next) {
        try {
            const content = await ContentService.getAllContent();
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async addNewContent(req, res, next) {
        try {
            const content = await ContentService.addNewContent(req.body);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async changeContent(req, res, next) {
        try {
            const content = await ContentService.changeContent(req.params.id, req.body);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async deleteContent(req, res, next) {
        try {
            const content = await ContentService.removeContent(req.params.id);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async changeProfileContent(req, res, next) {
        try {
            const content = await ContentService.changeProfileContent(req.params.id);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async changeProfileContents(req, res, next) {
        try {
            const content = await ContentService.changeProfilesContent(req.params.id, req.body.profile);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }

    async getProfileContent(req, res, next) {
        try {
            const content = await ContentService.getProfileContent(req.params.id);
            return res.json(content);
        } catch (e) {
            next(e);
        }
    }
}

export default new ContentController();
