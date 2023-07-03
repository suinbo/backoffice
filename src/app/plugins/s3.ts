import { s3Instance } from "@/utils/aws/s3"
import { Storage } from "@/utils/storage"

const s3KRClient = new s3Instance("ap-northeast-2")
const s3ENGClient = new s3Instance("ap-northeast-2")
const s3JPClient = new s3Instance("ap-northeast-2")
const s3AEClient = new s3Instance("ap-northeast-2")

export const s3Client = () => {
    const code: string = Storage.get(Storage.keys.regionCode)
    switch (code.toUpperCase()) {
        case "JP":
            return s3JPClient
        case "EN":
            return s3ENGClient
        case "AE":
            return s3AEClient
        case "KR":
        default:
            return s3KRClient
    }
}
