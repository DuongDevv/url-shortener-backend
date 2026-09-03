import { UrlRepository, UrlEntity } from './url.repository.js';             
   import { encodeBase62 } from '../../shared/utils/base62.js';                
                                                                               
   export class UrlService {                                                   
     private urlRepo: UrlRepository;                                           
                                                                               
     constructor() {                                                           
       this.urlRepo = new UrlRepository();                                     
     }                                                                         
                                                                               
     // Business Logic: Tạo Short URL                                          
     async createShortUrl(longUrl: string, customAlias?: string, userId?: string, expiresAt?: Date): Promise<UrlEntity> {                               
       // 1. Nếu có customAlias, dùng luôn làm short_key                       
       if (customAlias) {                                                      
         const existing = await this.urlRepo.findByShortKey(customAlias);      
         if (existing) {                                                       
           throw new Error('CUSTOM_ALIAS_ALREADY_EXISTS');                     
         }                                                                     
         return await this.urlRepo.create(longUrl, customAlias, userId, expiresAt);                                                                   
       }                                                                       
                                                                               
       // 2. Nếu không có customAlias: Insert tạm -> Convert ID string thành BigInt -> Base62 Encode                                                       
       const record = await this.urlRepo.create(longUrl, undefined, userId, expiresAt);                                                                   
       const generatedKey = encodeBase62(BigInt(record.id));                   
                                                                               
       await this.urlRepo.updateShortKey(record.id, generatedKey);             
       record.short_key = generatedKey;                                        
                                                                               
       return record;                                                          
     }                                                                         
                                                                               
     // Business Logic: Lấy Long URL để Redirect                               
     async getLongUrl(shortKey: string): Promise<string | null> {              
       const record = await this.urlRepo.findByShortKey(shortKey);             
       if (!record) return null;                                               
                                                                               
       // Check hết hạn link                                                   
       if (record.expires_at && new Date() > new Date(record.expires_at)) {    
         return null;                                                          
       }                                                                       
                                                                               
       return record.long_url;                                                 
     }                                                                         
   }         