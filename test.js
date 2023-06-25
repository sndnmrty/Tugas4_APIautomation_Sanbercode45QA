const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require ("chai").expect;
var userId;
var unitId;
var productId;


before (function (done){
    request.post('/authentications')
            .send({
                "email": "jaya@mail.com",
                "password": "1234"
            })
            .end(function(err,response){
                token = response.body.data.accessToken
                if(err){
                    throw err
                }
                done()
            })
})
//Regis
describe("Authorization - Registration", function(){
    //positive case
    it("(+)Memasukkan nama, email (dengan format yang valid yaitu mengandung @ dan .) dan password",
    async function(){
        const response = await request
                        .post("/registration")
                        .send({
                            "name": "Toko Jaya",
                            "email": "jaya@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(201);
        expect(await response.body.status).to.eql("success");
        console.log(response.body)
    })
    //negative case
    it("(-)Memasukkan nilai kosong pada kolom nama", async function (){
        const response = await request
                        .post("/registration")
                        .send({
                            "name": null,
                            "email": "jaya@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(400);
        expect(await response.body.status).to.eql("fail");
        console.log(response.body)
        console.log("Seharusnya inout nama tidak boleh kosong")
    })
})
//Login
describe("Authorization-Login", function(){
    //positive case
    it("(+)Memasukkan email (dengan format yang valid yaitu mengandung @ dan .) dan password",
    async function(){
        const response = await request
                        .post("/authentications")
                        .send({
                            "email": "jaya@mail.com",
                            "password": "1234"
                        });
        expect(await response.statusCode).to.eql(201);
        expect(await response.body.status).to.eql("success");
        console.log(response.body)
        
    })
    //negative case
    it("(-)Memasukkan password yang salah", async function (){
        const response = await request
                        .post("/authentications")
                        .send({
                            "email": "jaya@mail.com",
                            "password": "123456"
                        });
                        
        expect(await response.statusCode).to.eql(401);
        expect(await response.body.status).to.eql("fail");
        console.log(response.body)
        console.log("Password salah")
    })
})
//1.
describe("User - Create User", function(){
    //positive case
    it("(+)Membuat akun baru", (done)=>{
        request.post("/users")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "Dita Widya",
                    "email": "dita@mail.com",
                    "password": "jiasda2321@"
                })
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(201);
                    expect(await response.body.status).to.eql("success");
                    expect(await response.body.name).not.to.be.null;
                    expect(await response.body.email).not.to.be.null;
                    expect(await response.body.password).not.to.be.null;
                    console.log(response.body);
                    userId = response.body.data.userId;
                    if (err){
                        throw err
                    }
                    done()
                })                            
    })
    //Negative case
    it("(-)Membuat akun baru dengan password kosong", (done)=>{
        request.post("/users")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "Dita Widya",
                    "email": "dita@mail.com",
                    "password": ""
                })
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(400);
                    expect(await response.body.status).to.eql("fail");
                    console.log(response.body)
                    console.log("Password harus diisi")
                    if (err){
                        throw err
                    }
                    done()
                })                         
    })
})
//Get User Detail
describe("User - Get User Detail", function (){
    it("(+)Mengecek detai cutomer", (done)=>{
        request.get(`/users/${userId}`)
               .set('Authorization', `Bearer ${token}`)
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(200);
                    expect(await response.body.status).to.eql("success");
                    console.log(response.body)
                    if (err){
                        throw err
                    }
                    done()
                })
    })
})
//2.
describe("User - Update User", function (){
    it("(+)Update nama cutomer", (done)=>{
        request.put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "Dita Widya",
                    "email": "dita99@mail.com",
                })
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(200);
                    expect(await response.body.status).to.eql("success");   
                    expect(await response.body.name).not.to.be.null;
                    expect(await response.body.email).not.to.be.null;               
                    console.log(response.body)
                    if (err){
                        throw err
                    }
                    done()
                })
    })
    it("(-)Update nama cutomer menjadi kosong", (done)=>{
        request.put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "",
                    "email": "dita99@mail.com",
                })
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(400);
                    expect(await response.body.status).to.eql("fail");                    
                    console.log(response.body)
                    console.log("Data tidak dapat diupdate karena nama kosong")
                    if (err){
                        throw err
                    }
                    done()
                })
    })
})
//3.
describe("Units - Add Unit", function (){
    //positive case
    it("(+)Menambahkan data unit baru", (done)=>{
        request.post("/units")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "centimeter",
                    "description": "satuan panjang"
                })
                .end( function(err,response){
                    expect( response.statusCode).to.eql(201);
                    expect( response.body.status).to.eql("success");    
                    expect( response.body.name).not.to.be.null;
                    expect( response.body.description).not.to.be.null;             
                    unitId = response.body.unitId
                    console.log(response.body)
                    if (err){
                        throw err
                    }
                    done()
                })
    })
    //negative case
    it("(-)Menambahkan data unit baru, dengan deskripsi kosong", (done)=>{
        request.post('/units')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "name": "centimeter",
                    "description": ""
                })
                .end( function(err,response){
                    expect( response.statusCode).to.eql(400);
                    expect( response.body.status).to.eql("fail"); 
                    console.log(response.body)
                    console.log("Data tidak dapat ditambahkan karena deskripsi kosong")
                    if (err){
                        throw err
                    }
                    done()
                })
    })
})
//5
describe("Categories - Add Category", function(){
    //positive case
    it("(+)Menambahkan kategori baru", (done)=>{
        request.post("/categories")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "makanan cepat basi",
                    "description": "makanan yang masa konsumsinya cepat"
                })
                .end( function(err,response){
                    expect( response.statusCode).to.eql(201);
                    expect( response.body.status).to.eql("success");
                    expect( response.body.name).not.to.be.null;
                    expect( response.body.description).not.to.be.null;
                    console.log(response.body);
                    categoryId = response.body.data.categoryId;
                    if (err){
                        throw err
                    }
                    done()
                })                            
    })
    //negative case
    it("(+)Menambahkan kategori baru dengan kolom nama dan description kosong", (done)=>{
        request.post("/categories")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "name": "",
                    "description": ""
                })
                .end( function(err,response){
                    expect( response.statusCode).to.eql(400);
                    expect( response.body.status).to.eql("fail");
                    console.log(response.body);
                    console.log("Kolom nama dan deskripsi harus diisi")
                    if (err){
                        throw err
                    }
                    done()
                })                            
    })
})    
//6.
describe("Products - Add Product", function(){
    //positive case
    it("(+)Menambahkan produk baru", (done)=>{
        request.post("/products")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "category_id" : categoryId,
                    "code": "A314ASDDFIER3123",
                    "name": "momogi",
                    "price": "1500",
                    "cost": "1000",
                    "stock": "10"
                })
                .end( function(err,response){
                    expect( response.statusCode).to.eql(201);
                    expect( response.body.status).to.eql("success");
                    console.log(response.body);
                    productId = response.body.data.productId;
                    if (err){
                        throw err
                    }
                    done()
                })                            
    })
    //Negative case
    it("(-)Menambahkan produk baru dengan kolom kode kosong", (done)=>{
        request.post("/products")
               .set('Authorization', `Bearer ${token}`)
               .send({
                    "category_id" : "811f547e-a24e-4f94-bfe1-b7ed7d11c03f",
                    "code": "",
                    "name": "momogi",
                    "price": "1500",
                    "cost": "1000",
                    "stock": "10"
                })  
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(400);
                    expect(await response.body.status).to.eql("fail");
                    console.log(response.body)
                    console.log("Kolom code harus diisi")
                    if (err){
                        throw err
                    }
                    done()
                })                         
    })
})
//Delete User
describe("User - Delete User", function (){
    it("(+)Mengahpus data user", (done)=>{
        request.delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end(async function(err,response){
                    expect(await response.statusCode).to.eql(200);
                    expect(await response.body.status).to.eql("success");                    
                    console.log(response.body)
                    if (err){
                        throw err
                    }
                    done()
                })
    })
})