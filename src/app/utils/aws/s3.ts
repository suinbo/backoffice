import {
    GetBucketAclCommand,
    GetBucketAclCommandInput,
    ListBucketsCommand,
    ListObjectsCommand,
    ListObjectsCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from "@aws-sdk/client-s3"
import { S3UploadFiles, S3UploadResponse } from "./types"

/** 허용할 리전 리스트 */
const AllowRegions = ["ap-northeast-2"]

export class s3Instance {
    s3Client: S3Client = null

    /**
     * @constructor
     * @param {string} region - 전달된 리전 정보로 S3Client 객체 생성
     */
    constructor(region: string) {
        if (AllowRegions.includes(region)) {
            this.s3Client = new S3Client({
                region: region,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            })
        }
    }

    /** 특정 버킷의 컨텐츠 목록 조회 **/
    async getFileList(params: ListObjectsCommandInput) {
        try {
            const command = new ListObjectsCommand(params)
            const response = await this.s3Client.send(command)
            console.log(response)
        } catch (error) {
            /* empty */
        }
    }

    /** 특정 버킷의 ACL 권한 목록 조회 **/
    async getAclList(params: GetBucketAclCommandInput) {
        try {
            const command = new GetBucketAclCommand(params)
            const response = await this.s3Client.send(command)
            console.log(response.Grants)
            // return response
        } catch (error) {
            /* empty */
        }
    }
    /** 해당 리전의 버킷 목록 조회 **/
    async getBucketList() {
        try {
            const command = new ListBucketsCommand({})
            const response = await this.s3Client.send(command)
            console.log(response.Buckets)
            // return response
        } catch (error) {
            /* empty */
        }
    }

    /** 업로드 */
    async upload(params: PutObjectCommandInput) {
        const command = new PutObjectCommand(params)
        return this.s3Client.send(command)
    }

    /** 다중 업로드 */
    async multiUpload(params: S3UploadFiles, callbackFn: (res: S3UploadResponse[]) => void) {
        const { bucket, files } = params
        const uploadData: S3UploadResponse[] = []
        if (!!files && !!files.length) {
            const promises = files.map(async item => {
                const { key, file } = item
                await this.upload({
                    Bucket: bucket,
                    Key: key,
                    Body: file,
                    ContentType: file.type,
                })
                    .then(response => {
                        uploadData.push({ key: key, code: true })
                        console.log("Current Succeed response is : ", response)
                        console.log("Successfully created " + key + " and uploaded it to " + bucket + "/" + key)
                    })
                    .catch(() => {
                        uploadData.push({ key: key, code: false })
                    })
            })

            await Promise.all(promises)
        }
        callbackFn(uploadData)
    }
}
