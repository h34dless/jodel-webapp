﻿import { Db } from "./db";
import { Texttools } from './texttools';
import { COLORS, POSTWEIGHT } from './constants'
import { MostSimilar, interpolatedResult, Citydata, HashandKeyResult, keyorhash, JodelJSON, coreJodelJSON, JRESULT, Keywords } from './resultinterfaces'
/**
 * At last this Class will generate the Result for the Front-End
 * @author Tim Mend
 */
export class JResult
{
    Jodel: string;
    interPolatedResult: interpolatedResult;
    similarJodel: Jodel;
    db: Db;
    texttools: Texttools;
    keywords: any[] = [];

    hashtags: HashandKeyResult[] =[];
    time: any[];
    cityimportance: Citydata[];

    constructor(jodel: string, db: Db)
    {
        this.Jodel = jodel;
        this.db = db;
        this.texttools = new Texttools();
    }
    //TODO: Maybe not the best way to handle this.. get Most Similiar returns many values I just take the first
    /**
     * This function will create the Result for the Frontend for a given Message. 
     * @author Tim Mend
     */
    public async getResult()
    {
        console.log("")
        process.stdout.write("Getting similiar post")
        let analogical: MostSimilar = await this.db.getMostSimiliar(this.Jodel);

        if (analogical.HashtagPosts.length == 0 && analogical.KeyWordPosts.length == 0)
        {
            //TODO: Yeah... shitty solution for the problem if there is no similiar Jodel.
            this.similarJodel = new Jodel("5a15f935a8299c3a35452472", this.db);
        } else if (analogical.MostSimiliar.length == 0)
        {

            if (analogical.HashtagPosts.length != 0)
            {
                this.similarJodel = new Jodel(analogical.HashtagPosts[0], this.db);

            }
            else
            {
                this.similarJodel = new Jodel(analogical.KeyWordPosts[0], this.db);
            }

        }
        else
        {
            //Set First MostSimiliar Jodel as Most Similiar Jodel
            this.similarJodel = new Jodel(analogical.MostSimiliar[0], this.db)
        }


        //Gather Data
        await this.similarJodel.fill();


        let res2:string[] = await this.texttools.extractHashtags(this.Jodel);
        let res3:Keywords[] = await this.texttools.extractKeywords(this.Jodel);
        let time_value: string[] = [];
        for (let time in res3)
        {
            time_value.push(res3[time].name);
        }
        let timetable = await this.getTimeChart(time_value);
        let timeobj: {
            votes: number,
            hour: string
        }[] = [];
        for (let tt in timetable)
        {
            timeobj.push({
                votes: timetable[tt].votes,
                hour: timetable[tt].hour
            })
        }

        this.time = timeobj;

        process.stdout.write("Getting Hashtags and Keywords")
        for (let key1 in res3)
        {
            let _tmp: Citydata[] = [];
            process.stdout.write(".");
            let keynum = await this.db.getCityKeywordAmount(res3[key1].name);
            process.stdout.write(".");
            let simKeyword = await this.db.getSimiliarKeywords(res3[key1].name);
            let simHashtag = await this.db.getSimiliarHashtags(res3[key1].name);
            let time_tmp: string[] = [];
            time_tmp.push(res3[key1].name);
            let timetable_2 = await this.getTimeChart(time_tmp);
            let timeobj_keys: {
                votes: number,
                hour: string
            }[] = [];
            for (let tt in timetable_2)
            {
                timeobj_keys.push({
                    votes: timetable_2[tt].votes,
                    hour: timetable_2[tt].hour
                })
            }
            let simKeywords: {
                name: string,
                votes: number,
                color: string,
                maxVal: number
            }[] = [];
            let simHashtags: {
                name: string,
                votes: number,
                color: string,
                maxVal: number
            }[] = [];
            for (let i = 0; i < 4; i++)
            {
                simKeywords.push({
                    name: simKeyword[i].post_keyword,
                    votes: simKeyword[i].votes,
                    color: await this.getRandomColor(simKeyword[i].post_keyword),
                    maxVal: 0
                });
            }
            let maxVAL_simkey = 0;
            for (let key in simKeywords)
            {
                maxVAL_simkey = Math.max(maxVAL_simkey * 1, simKeywords[key].votes * 1);
            }
            for (let key in simKeywords)
            {
                simKeywords[key].maxVal = maxVAL_simkey;
            }



            let i_hash = simHashtag.length > 4 ? 4 : simHashtag.length;
            for (let i_h = 0; i_h < i_hash; i_h++)
            {
                simHashtags.push({
                    name: simHashtag[i_h].hashtag,
                    votes: simHashtag[i_h].votes,
                    color: await this.getRandomColor(simHashtag[i_h].hashtag),
                    maxVal: 0
                })
            }
            let maxVAL_simhash = 0;
            for (let key in simHashtags)
            {
                maxVAL_simhash = Math.max(maxVAL_simhash * 1, simHashtags[key].votes * 1);
            }
            for (let key in simHashtags)
            {
                simHashtags[key].maxVal = maxVAL_simhash;
            }



            for (let key2 in keynum)
            {
                
                _tmp.push({
                    name: keynum[key2].name,
                    votes: keynum[key2].amount,
                    id_cities: keynum[key2].id_cities
                })

            }
            this.keywords.push({
                name: res3[key1].name,
                amount: res3[key1].amount,
                citydata: _tmp,
                maxValue: 0,
                similiar: simKeywords,
                similiarHashtags: simHashtags,
                timetable: timeobj_keys,
                color: await this.getRandomColor(res3[key1].name)
            })
        }

        ///////Get max Keyword
        let maxVAL = 0;
        for (let key in this.keywords)
        {
            maxVAL = Math.max(maxVAL * 1, this.keywords[key].amount* 1 )
        }

        for (let key in this.keywords)
        {
            this.keywords[key].maxValue = maxVAL;
        }


        let _null: string[] = []
        for (let hashi in res2)
        {
            let simHashtagsarr: {
                name: string,
                votes: number,
                color: string
            }[] = [];
            let _tmp: Citydata[] = [];
            let tmp = await this.db.getHashtagAmount(res2[hashi]);
            let hashnum = await this.db.getCityHashtagAmount(res2[hashi]);
            
            process.stdout.write(".");

            for (let key3 in hashnum)
            {
                _tmp.push({
                    name: hashnum[key3].loc_name,
                    votes: hashnum[key3].amount,
                    id_cities: hashnum[key3].id_cities
                })
            }

            this.hashtags.push({
                name: res2[hashi],
                amount: tmp[0].amount,
                citydata: _tmp,
                maxValue: 0,
                similiar: simHashtagsarr,
                color: await this.getRandomColor(res2[hashi])
            })
        }
        // Get Max hashtag Value
        maxVAL = 0;
        for (let key in this.hashtags)
        {
            maxVAL = Math.max(maxVAL * 1, this.hashtags[key].amount * 1);
        }
       
        for (let key in this.hashtags)
        {
            this.hashtags[key].maxValue = maxVAL;
        }

        process.stdout.write("Generating Votes")
        await this.interPolateResult(analogical);
        process.stdout.write("Generating City Importance")
        let _cityimportance = await this.generateCityImportance();

        this.cityimportance = Object.values(_cityimportance);
        
        return new Promise((resolve) =>
        {
            resolve(true);
        })

    }

    private async getTimeChart(arr: string[])
    {

        let timehours = await this.db.getClockVotesAmount(arr);
        let newTimehour = [];

        return new Promise((resolve) =>
        {

        
        for (let I in timehours)
        {
            let i = Number(I);
            let timehour = timehours[i];
            timehour.hour = Number(timehour.hour)
            let j = i + 1;
            if (j >= timehours.length) j = 0;
            let nexthour = timehours[j];
            let difference = nexthour.votes - timehour.votes;
            let timedifference;
            if (timehour.hour > nexthour.hour)
            {
                timedifference = 24 - timehour.hour + nexthour.hour;
            } else
            {
                timedifference = nexthour.hour - timehour.hour;
            }

            newTimehour.push({
                votes: timehour.votes,
                hour: timehour.hour,
            })
            let stepsize = difference / timedifference;
            for (let k = 1; k < timedifference; k++)
            {
                let index = i + k;
                let hour = timehour.hour + k;
                // if(index  >= timehours.length) hour = hour;
                if (hour >= 24) hour = hour - 24;
                newTimehour.push({
                    votes: Math.round(timehour.votes + (stepsize * k)),
                    hour: hour,
                })
            }
            }
            resolve(newTimehour);
        })
    }

    private async getRandomColor(text: string)
    {
        let _res = 0;
        for (let i = 0; i < text.length; i++)
        {
           _res += text.charCodeAt(i)
        }
        
        _res = _res % 6;
        
        for (let key in COLORS)
        {
            if (COLORS[key].id == _res)
            {
                
                return COLORS[key].color;
            }
        }
    }

    /**
     * This will create create the Votes, Pins, Comments and similiar Keywords for a Post based on the similiar Post 
     * @param keys the keys from the similiar Posts
     * @author Tim Mend
     */
    private async interPolateResult(keys: MostSimilar)
    {
        let maxVotes = 0;
        let sum = 0;
        let sum_comments = 0;
        let maxKommis = 0;
        let jresult_keywords: keyorhash[] = [];
        let jresult_hashtags: keyorhash[] = [];
        let keywords_similiar: keyorhash[] = [];
        let hashtags_similiar: keyorhash[] = [];
        //TODO: YEAH.... ^^
        //Get Keywords out of keywords array from JRESULT 
        for (let key in this.keywords)
        {
            let _tmp: keyorhash = {
                name: this.keywords[key].name,
                value: Math.floor(Math.random() * 100),
                color: await this.getRandomColor(this.keywords[key].name),
                maxValue: 0
            }
            jresult_keywords.push(_tmp);
        }

        //Get Hashtags out of hashtags array from JRESULT
        for (let hash in this.hashtags)
        {
            let _tmp: keyorhash = {
                name: this.hashtags[hash].name,
                value: Math.floor(Math.random() * 100),
                color: await this.getRandomColor(this.hashtags[hash].name),
                maxValue: 0
            }
            jresult_hashtags.push(_tmp);
        }



        let i = keys.KeyWordPosts.length > 2 ? 2 : keys.KeyWordPosts.length;
        for (let k = 0; k < i; k++)
        {   
          let keywords_similiar_post = await this.db.getKeywordsById(keys[k].post_id);
            let _tmpJresult = jresult_keywords.map(a => a.name);
            //Get relational Keywords out of the similiar Jodel
            for (let key in keywords_similiar_post)
            {
                process.stdout.write(".");
                if (!(keywords_similiar.includes(keywords_similiar_post[key].post_keyword) || _tmpJresult.includes(keywords_similiar_post[key].post_keyword)))
                    {
                    keywords_similiar.push({
                        name: keywords_similiar_post[key].post_keyword,
                        value: Math.floor(Math.random() * 100),
                        color: await this.getRandomColor(keywords_similiar_post[key].post_keyword),
                        maxValue: 0
                    }
                    );
                    }
                
            }
            for (let z = 0; z < 4; z++)
            {
                if (keywords_similiar.length > 4)
                {
                    keywords_similiar.pop();
                }
            }

            let maxVAL = 0;
            for (let key in keywords_similiar)
            {
                maxVAL = Math.max(maxVAL * 1, keywords_similiar[key].value * 1);
            }
            for (let key in keywords_similiar)
            {
                keywords_similiar[key].maxValue = maxVAL;
            }


            //Same as keywords
            let hashtags_similiar_post = await this.db.getHashtagsById(keys[k].post_id);
             for (let hash in hashtags_similiar_post)
            {
                process.stdout.write(".");
                if (!(jresult_hashtags.includes(hashtags_similiar_post[hash].post_tag) || hashtags_similiar.map(a => a.name).includes(hashtags_similiar_post[hash].post_tag)))
                {
                    hashtags_similiar.push({
                        name: hashtags_similiar_post[hash].post_tag,
                        value: Math.floor(Math.random() * 100),
                        color: await this.getRandomColor(hashtags_similiar_post[hash].post_tag),
                        maxValue: 0
                    });
                        
                }
            }

            maxVAL = 0;
            for (let key in hashtags_similiar)
            {
                maxVAL = Math.max(maxVAL * 1, hashtags_similiar[key].value * 1);
            }
            for (let key in hashtags_similiar)
            {
                hashtags_similiar[key].maxValue = maxVAL;
            }


            let tmp = await this.db.getPostById(keys[k].post_id);

            
            if (tmp.length == 0)
            {
                let tmp = await this.db.getChildById(keys[k].post_id);
                sum += parseInt(tmp[0].vote_count);
                process.stdout.write(".");
            }
            else
            {

                maxVotes = Math.max(tmp[0].votes * 1, maxVotes * 1); 
                maxKommis = Math.max(tmp[0].child_count * 1, maxKommis*1);
                sum_comments += parseInt(tmp[0].child_count)

                sum += parseInt(tmp[0].votes);
                process.stdout.write(".");
            }


        }
        return new Promise((resolve) =>
        {
            let _res:interpolatedResult = {
                Votes: Math.ceil((sum / keys.KeyWordPosts.length)),
                Comments: Math.ceil((sum_comments / keys.KeyWordPosts.length)),
                Pins: Math.ceil((sum / keys.KeyWordPosts.length) * 0.15),
                maxValue: Math.max(maxVotes, Math.ceil((sum / keys.KeyWordPosts.length))),
                maxKommentare: Math.max(maxKommis, Math.ceil((sum_comments / keys.KeyWordPosts.length))),
                Keywords_similiar: keywords_similiar,
                Hashtag_similiar: hashtags_similiar
            }
            this.interPolatedResult = _res;
            return resolve(_res)
        })
        
    }

    /**
     * This will create a Array of the succes of a post in the cities based on the keywords and hashtags used in the post
     * @author Tim Mend
     */
    private async generateCityImportance()
    {
        return new Promise((resolve) =>
        {
            let sum: Citydata[] = this.keywords[0]['citydata'];
            for (let b = 1; b < this.keywords.length; b++)
            {
                let key_tmp: any = this.keywords[b]['citydata'];
                for (let n = 0; n < sum.length; n++)
                {
                    for (let m = 0; m < key_tmp.length; m++)
                    {
                        if (sum[n].name == key_tmp[m].city)
                        {
                            sum[n].votes += key_tmp[m].amount;
                        }
                        //if (m == key_tmp.length && sum[n].city != key_tmp[m].city)
                        //{
                        //    sum.push(key_tmp[m]);
                        //}
                    }
                }
            }
            for (let i = 0; i < this.hashtags.length; i++)
        {
            let hash_tmp: Citydata[] = this.hashtags[i]['citydata'];
            for (let j = 0; j < sum.length; j++)
            {
                for (let k = 0; k < hash_tmp.length; k++)
                {
                    if (sum[j].name == hash_tmp[k].name)
                    {
                        sum[j].votes += hash_tmp[k].votes;

                    }
                    //if (k == hash_tmp.length && sum[j].city != hash_tmp[k].city)
                    //{
                    //    sum.push(hash_tmp[k]);
                    //}
                }
            }
            
            }
            resolve(sum);
        })
    }

    public toJSON(): JRESULT
    {

        return {
            message: this.Jodel,
            interPolatedResult: this.interPolatedResult,
            time: this.time,
            hashtags: this.hashtags,
            keywords: this.keywords,
            jodel: this.similarJodel.encodeJodel(),
            cityimportance: this.cityimportance
        };
    }
}


 
/** This class will collect Information about a whole Jodel - no Children. 
 * @author Tim Mend 
 */
export class Jodel
{
    core: coreJodel;
    children: coreJodel[] = [];
    //created_at: string;
    image_approved: Boolean;
    image_url: string;
    child_count: Number;
    post_color: string;
    oj_replied: Boolean;
    voute_count_timestamp: string;

    constructor(post_id: string, db: Db)
    {
        this.core = new coreJodel(post_id, db);
    }


    public async fill()
    {
        await this.core.fill();
        if (this.core.post.length != 0)
        {
            this.children = [];

            let children = await this.core.db.getChildrenById(this.core.post_id);
            for (let key in children)
            {
                let tmp = new coreJodel(children[key].child_id, this.core.db);
                await tmp.fill();
                this.children.push(tmp);
            }
            return new Promise((resolve) =>
            {
                //this.created_at = this.core.post[0].created_at;
                this.image_approved = this.core.post[0].image_approved;
                this.image_url = this.core.post[0].image_url;
                this.child_count = this.core.post[0].child_count;
                this.post_color = this.core.post[0].post_color;
                this.oj_replied = this.core.post[0].oj_replied;
                this.voute_count_timestamp = this.core.post[0].vote_count_timestamp;
                return resolve(true);
            })
        }

    }
    

    public encodeJodel(): JodelJSON
    {
        return {
            core: this.core.encodeCoreJodel(),
            image_approved: this.image_approved == undefined ? false : this.image_approved,
            image_url: this.image_url == undefined ? "" : this.image_url,
            child_count: this.child_count == undefined ? 0 : this.child_count,
            oj_replied: this.oj_replied == undefined ? false : true,
            children: this.createChildrenArray(this.children) == undefined ? [] : this.createChildrenArray(this.children)
        };

    }

    private createChildrenArray(core: coreJodel[])
    {
        let tmp: coreJodelJSON[] = [];

        core.forEach((item, index) =>
        {
            tmp.push(item.encodeCoreJodel());
        })


        return tmp;
    }

}




/**
 * This is the Class for collecting the coreJodel Info - here can any Jodel be safed
 * Children too.
 * @author Tim Mend
 */
export class coreJodel
{
    post_id: string;
    vote_count: Number;
    post_color: string;
    post_message: string;
    keywords: string[] = [];
    tags: string[] = [];
    location: string;
    db: Db;
    post: any;
    created_at: string;
    constructor(post_id: string,  db: Db)
    {
        this.post_id = post_id;
        this.db = db;
    }

    public async fill()
    {
        this.post = await this.db.getPostById(this.post_id);
        let res = await this.db.getMessageById(this.post_id);
        this.post_message = res[0].post_message;
        if (this.post.length == 0)
        {
            res = await this.db.getChildById(this.post_id);
            this.post_color = res[0].post_color;
            this.vote_count = res[0].vote_count;
            res = await this.db.getLocationByIdChild(this.post_id);
            this.location = res[0].loc_name;
            let time_tmp = await this.db.getCreatedByIdChild(this.post_id);
            let time_tmp_string = time_tmp[0].created_at;
            let time_tmp_res = time_tmp_string.split("T");
            let time_tmp_res_final = time_tmp_res[1].split(".");
            this.created_at = time_tmp_res_final[0];
            
        }
        else
        {
            this.post_color = this.post[0].post_color;
            this.vote_count = this.post[0].votes;
            res = await this.db.getLocationById(this.post_id);
            let time_tmp = this.post[0].created_at.split("T");
            let time_tmp_res = time_tmp[1].split(".");
            this.created_at = time_tmp_res[0];
            
            this.location = res[0].loc_name;
        }
        res = await this.db.getKeywordsById(this.post_id);
        res.forEach((item, index) =>
        {
            this.keywords.push(item.post_keyword);
        })

        res = await this.db.getTagsById(this.post_id);
        res.forEach((item, index) =>
        {
            this.tags.push(item.post_tag)
        })
        return new Promise((resolve) =>
        {
            resolve(true);
        })
    }
    public encodeCoreJodel(): coreJodelJSON
    {
        return {
            post_id: this.post_id,
            vote_count: this.vote_count,
            post_color: this.post_color,
            post_message: this.post_message,
            keywords: this.keywords,
            tags: this.tags,
            location: this.location,
            created_at: this.created_at
        };

    }
}


