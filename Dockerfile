 # ==========================================               
   # STAGE 1: BUILD STAGE (Compile TypeScript)                
   # ==========================================               
   FROM node:20-alpine AS builder                             
                                                              
   WORKDIR /app                                               
                                                              
   # Copy package files để tận dụng Docker Cache Layer        
   COPY package*.json tsconfig.json ./                        
                                                              
   # Cài đặt toàn bộ dependencies (gồm cả devDependencies)    
   RUN npm ci                                                 
                                                              
   # Copy toàn bộ code nguồn                                  
   COPY . .                                                   
                                                              
   # Build TypeScript thành JavaScript thuần trong folder     
 /dist                                                        
   RUN npx tsc                                                
                                                              
   # ==========================================               
   # STAGE 2: PRODUCTION RUNTIME STAGE                        
   # ==========================================               
   FROM node:20-alpine AS runner                              
                                                              
   WORKDIR /app                                               
                                                              
   ENV NODE_ENV=production                                    
                                                              
   # Copy package files                                       
   COPY package*.json ./                                      
                                                              
   # Chỉ cài sản phẩm Production Dependencies (Bỏ devDeps)    
   RUN npm ci --only=production && npm cache clean --force    
                                                              
   # Copy thư mục build dist từ STAGE 1                       
   COPY --from=builder /app/dist ./dist                       
                                                              
   # Bảo mật: Đổi user từ root sang non-root user 'node'      
   USER node                                                  
                                                              
   EXPOSE 3000                                                
                                                              
   CMD ["node", "dist/app.js"]  