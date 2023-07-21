document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
        message: '',
        checkOutPayment:false,
        buyer:true,
        paymentMessage:'',
        paymentAmount:0.00,
        userInput:'',
        username:'leratoMalebo',
        cart_code: '',
        pizzas: [],
        featured:[],
        clist:[],
        cartObj:{total:0},
        displayCart:false,
        init() {
  
          const url_Link = 'https://pizza-api.projectcodex.net/api/pizzas'
          axios
            .get(url_Link)
            .then((result) => {
              this.pizzas = result.data.pizzas
            })
            .then(() => {
              return this.createCart()
            })
            
            .then((result) => {
              console.log(result.data)
              
              this.cart_code = result.data.cart_code
            })
            .then(()=>{
              return this.featuredPizzas()
            })
          
            
        },
        showCart(){
          const showCartURL='https://pizza-api.projectcodex.net/api/pizza-cart/'+this.cart_code+'/get'
          axios
            .get(showCartURL)
            .then((result)=>{
              this.cartObj=result.data
            })
        },
        createUser(){
          this.username = this.userInput
          console.log(this.username)
        }, 
        createCart() {
          const createURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/create?username=' + this.username
          return axios
            .get(createURL)
            
  
        },
        add(pizza) {
          const addToCartURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/add'
          const params = {
            cart_code: this.cart_code,
            pizza_id: pizza.id
          }
          axios
            .post(addToCartURL,params)
            .then(()=>{
              this.message='pizza addedd to cart'
              this.showCart()
            })
        },
        removeItem(pizza){
          const removeFromCartURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/remove'
          const params = {
            cart_code: this.cart_code,
            pizza_id: pizza.id
          }
          axios.post(removeFromCartURL,params).then(()=>{
            this.message='pizza removed from cart'
            this.showCart()
          })
        },
        
        checkOutPizza(){
          const checkOutUrl = 'https://pizza-api.projectcodex.net/api/pizza-cart/pay'
          const params = {
            cart_code: this.cart_code,
          }
          axios.post(checkOutUrl,params).then(()=>{
            
            if(!this.paymentAmount){
              this.paymentMessage='No amount entered!'
          }
          if(this.paymentAmount>=this.cartObj.total){
              this.paymentMessage='Payment Successful!!'
              this.message='Paid'
              setTimeout(()=>{
                  this.checkOutPayment=false
                  //this.clearCart();
                  location.reload()
              },3000)
              
          }else{
            this.message='Payment Failed, İnsufficient Amount'
            this.paymentMessage='Payment Failed!!'
          }
          })
  
        },
        featuredPizzas(){
          const featuredURL='https://pizza-api.projectcodex.net/api/pizzas/featured'
          axios.get(featuredURL)
          .then((result) => {
            this.featured = result.data.pizzas
          })
        },
        OrderHistory(){
          ordersUrl = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username/${this.username}`
          
          axios.get(ordersUrl).then((result)=>{
            this.clist = result.data
            console.log(this.clist)
            
          })
        },
        getActiveCart(){
          activeCartUrl = `https://pizza-api.projectcodex.com/api/pizza-api/username/${this.username}/active`
          axios.get(activeCartUrl).then(function(result){
            console.log(result.data)
          })
        }
      }
    })
  })