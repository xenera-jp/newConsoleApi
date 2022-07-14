import db from "../db/index.js";
import ApiError from "../exceptions/api-error.js";

class ContentService {
    async getContentProfile() {
        const request = `Select * from profile_settings_content order by id asc`;

        const result = await db.query(request, []);
        if (result.rowCount === 0) throw ApiError.NotFound();
        return result.rows;
    }

    async getContentUserClickTracking() {
        const request = `Select * from user_click_tracking_content order by id asc`;

        const result = await db.query(request, []);
        if (result.rowCount === 0) throw ApiError.NotFound();

        return result.rows;
    }

    async addNewContent(newContent){
        const exists = await this.getAllContent(true);
        if(exists.some(e => e.name === newContent.name))
            throw ApiError.BadRequest("This name already exists");

        const request = `Insert into contents (name, parents) values ($1, $2) returning *`;
        const result = await db.query(request, [newContent.name, newContent.parents]);
        if(result.rowCount === 0)
        throw ApiError.ServerException();

        const allProfiles = (await db.query("Select id from profiles Group by id Order by id asc")).rows;
        let insertIntoProfiles =  "Insert into contents_profile (content_id, profile_id) values ";
        let arrayToInsert = [];

        let counter = 1;

        insertIntoProfiles += allProfiles.map(x=>`($${counter++}, $${counter++})`).join(", ");
        allProfiles.forEach(x=>{
            arrayToInsert.push(result.rows[0].id, x.id);
        })

        const insertedProfiles = await db.query(insertIntoProfiles, arrayToInsert);
        if(insertedProfiles.rowCount === 0)
            throw ApiError.ServerException();

        return await this.getAllContent();
    }

    async changeContent(id, newContent){
        const exists = await this.getAllContent(true);
        if(exists.some(e => e.name === newContent.name && e.id !== parseInt(id)))
            throw ApiError.BadRequest("This name already exists");

        const request = `Update contents set name = $1, parents = $2 where id = $3`;
        const result = await db.query(request, [newContent.name, newContent.parents, id]);
        if(result.rowCount === 0)
            throw ApiError.ServerException();
        else return await this.getAllContent();
    }

    async removeContent(id){
        const exists = await this.getAllContent(true);
        if(!exists.some(e => e.id !== parseInt(id)))
            throw ApiError.NotFound();

        const request = `Delete from contents where id = $1`;
        const result = await db.query(request, [id]);
        if(result.rowCount === 0)
            throw ApiError.ServerException();
        else return await this.getAllContent();
    }

    async getAllContent(onlyNames = false) {
        const request = `Select * from contents order by id asc`;

        const result = await db.query(request, []);

        const content = result.rows;
        console.log(content);
        if(onlyNames)
            return content;

        function allDescendants (element) {
            const childs = content.filter(x=>String(x.parents)?.split(', ').includes(element.id.toString()));
            return{
                parent: element,
                childs: childs.map(x=>allDescendants(x))
            }
        }

        console.log(content);
       return {allContents: content, body:content.filter(x=>!x.parents).map(c=>allDescendants(c))};
    }

    async changeProfileContent(id, newStatus){
        const request = `Update contents_profile set enabled = $1 where id = $2 returning *`
        const result = (await db.query(request, [newStatus, id])).rows;
        if(result.length === 0)
            throw ApiError.ServerException();
        else return result;
    }

    async changeProfilesContent(id, profile){
        let counter = 1;
        let request = `Update contents set enabled = CASE profile_id `
          + profile.map(x=>`when $${counter++} then $${counter++}`)
          + "else enabled end where profile_id in ("
          + profile.map(x=>`$${counter++}`).join(", ")
          + ') returning *';

        const arrayValues = [];
        const idS = [];

        profile.forEach(x=>{
            arrayValues.push(x.id, x.enabled);
            idS.push(x.id);
        })

        const result = (await db.query(request, [...arrayValues, ...idS])).rows;
        if(result.length !== profile.length)
            throw ApiError.ServerException();
        else return result;
    }

    async getProfileContent(id){
        const request = "Select * from contents_profile where profile_id = $1";
        const result = (await db.query(request, [id])).rows;

        const content = (await this.getAllContent());
        if(result.length === 0)
        {
            if(content.allContents.length > 0)
            {
                let counter = 1;
                const insertAllContent = "Insert into contents_profile (content_id, profile_id) values " + content.allContents.map(x=>`($${counter++}, $${counter++})`).join(", ") + " returning *";
                const array = [];
                content.allContents.forEach(x=>{
                    array.push(x.id, id);
                })

                const result = (await db.query(insertAllContent, array)).rows;
                if(result.length === 0)
                    throw ApiError.ServerException();
            }
        }

        const getAllContent = (await db.query("Select * from contents_profile where profile_id = $1 order by content_id asc", [id])).rows;

        return {
            profile: getAllContent,
            mainContent: content.body
        }
    }
}

export default new ContentService();
