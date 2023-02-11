let productList = [];
let cartList = [];


const fechProductList = () => {
    batLoading();
    axios({
        url: 'https://63cf5b70e52f5878299db316.mockapi.io/products',
        method: 'GET',
    })
    .then((res) => {
        tatLoading()
        productList = res.data.map((item) => {
            return new ProductList(
                item.id,
                item.name,
                item.price,
                item.screen,
                item.backCamera,
                item.frontCamera,
                item.img,
                item.desc,
                item.type,
            )
        });
        renderProduct(productList);
    })
    .catch((err) => {
        tatLoading
    })
}
fechProductList();
// data test
// let nhap = () => {
//     batLoading();
//     axios({
//         url: 'https://63bea800f5cfc0949b5d49ca.mockapi.io/Product',
//         method: 'GET',
//     })
//     .then((res) => {
//         tatLoading()
//         console.log("🚀 ~ file: main.js:41 ~ .then ~ res", res.data)
//     })
//     .catch((err) => {
//         tatLoading
//     })
// }

// render product list
const renderProduct = (productList) => {
    let contentHTML = productList.map((product) => {
        return `
        <!-- item -->
                    <div class="product-item">
                        <div class="content-item">
    
                            <!-- top -->
                            <div class="content-top">
                                <p>${product.type}</p>
                                <em>In Stock</em>
                            </div>
    
                            <!-- img -->
                            <div class="content-img">
                                <img src="${product.img}" alt="">
                            </div>
    
                            <!-- details -->
                            <div class="content-details">
                                <div>
                                    <div class="details-name">
                                        <h4>${product.name}</h4>
                                        <button onclick="like(this)"><i class="fa-solid fa-heart"></i></button>
                                    </div>
                                    <div class="details-text">
                                        <p class="screen">Màn hình: ${product.screen}</p>
                                        <p class="back-camera">Camera trước: ${product.backCamera}</p>
                                        <p class="front-camera">Camera sau: ${product.frontCamera}</p>
                                        <p class="desc">Desc: ${product.desc}</p>
                                    </div>
                                </div>
                                <!-- price-buy -->
                                <div class="price-buy">
                                    <p>$ <span>${product.price}</span></p>
                                    <div class="buy-now" id="buy-now-js">
                                        <button onclick="addProductCart(this, ${product.id})">Buy now</button>
                                    </div>
                                    <div class="buy-content" id="buy-content-js">
                                        <div class="buy-quantity">
                                            <button onclick="chonGiamSoLuong(this, ${product.id})">
                                                <i class="fa-solid fa-caret-left"></i>
                                            </button>
                                            <span>${quantityCartItem(product.id, cartList)}</span>
                                            <button onclick="chonTangSoLuong(this, ${product.id})">
                                                <i class="fa-solid fa-caret-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        `
    });
    document.getElementById('productList').innerHTML = contentHTML;
    showQuantityProduct();
}

// render giỏ hàng
const renderCart = (cartList) => {
    if(cartList.length == 0) {
        let content = `
            <div id="tbCart">Looks Like You Haven't Added Any Product In The Cart</div>
        `
        document.getElementById('cart-list-js').innerHTML = content;
    }
    else {
        let contentHTML = cartList.map((cartItem) => {
            return `
            <div class="cart-item">
                            <div class="cart-img">
                                <img src="${cartItem.product.img}" alt="">
                            </div>
                            <div class="cart-name">${cartItem.product.name}</div>
                            <div class="cart-quantity">
                                <button onclick="giamSoLuongCart(${cartItem.product.id})">
                                    <i class="fa-solid fa-caret-left"></i>
                                </button>
                                <span>${cartItem.quantity}</span>
                                <button onclick="tangSoLuongCart(${cartItem.product.id})">
                                    <i class="fa-solid fa-caret-right"></i>
                                </button>
                            </div>
                            <div class="cart-price">
                                $ <span>${(cartItem.quantity * cartItem.product.price)}</span>
                            </div>
                            <div class="cart-delete">
                                <button onclick="xoaCartItem(${cartItem.product.id})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
            `
        }).join('');
        document.getElementById('cart-list-js').innerHTML = contentHTML;
    }
    // hiện số lượng ở góc giỏ hàng
    document.getElementById('shopping-cart-quantity').innerText = tongSoLuongCartItem(cartList);
    // hiện tổng thanh toán
    document.getElementById('tongTienAll-js').innerText = tongTienAll();
}

// chọn giảm số lượng ở sản phẩm
const chonGiamSoLuong = (el, id) => {
    let contentItem = el.parentElement.parentElement.parentElement.parentElement.parentElement;
    let viTri = vitriCartList(id, cartList);
    cartList[viTri].quantity -= 1;
    contentItem.querySelector('#buy-content-js span').innerText = cartList[viTri].quantity;

    if(cartList[viTri].quantity == 0) {
        cartList.splice(viTri,1);
        contentItem.querySelector('#buy-content-js span').innerText = 0;
    }
    //
    renderCart(cartList);
    setCartList();
    //hiện lại nút add khi == 0
    showBuyNow(contentItem);
}
// chọn tăng số lượng ở sản phẩm
const chonTangSoLuong = (el, id) => {
    let contentItem = el.parentElement.parentElement.parentElement.parentElement.parentElement;
    let viTri = vitriCartList(id, cartList);
    cartList[viTri].quantity += 1;
    contentItem.querySelector('#buy-content-js span').innerText = cartList[viTri].quantity;
    
    //
    renderCart(cartList);
    setCartList();
}

// chọn giảm số lượng ở sản phẩm
const addProductCart = (el, id) => {
    let contentItem = el.parentElement.parentElement.parentElement.parentElement;
    showQuantity(contentItem);
    let viTri = vitriProductList(id, productList);
    let viTriCart = vitriCartList(id, cartList);
    if(viTriCart == -1) {
        let cartItem = {
            product: productList[viTri],
            quantity: 1
        }
        cartList.push(cartItem);
        contentItem.querySelector('.buy-quantity span').innerText = cartItem.quantity;
    }
    else {
        cartList[viTriCart].quantity += 1;
        contentItem.querySelector('.buy-quantity span').innerText = cartList[viTriCart].quantity;
    }


    //
    renderCart(cartList);
    setCartList();
}

// chọn giảm số lượng ở giỏ hàng
const giamSoLuongCart = (id) => {
    let viTri = vitriCartList(id, cartList);
    cartList[viTri].quantity -= 1;
    if(cartList[viTri].quantity == 0) {
        cartList.splice(viTri,1);
    }

    //
    renderCart(cartList);
    setCartList();
    renderProduct(productList);
}
// chọn tăng số lượng ở giỏ hàng
const tangSoLuongCart = (id) => {
    let viTri = vitriCartList(id, cartList);
    cartList[viTri].quantity += 1;
    //
    renderCart(cartList);
    setCartList();
    renderProduct(productList);
}
// xoá 1 sản phẩm trong giỏ hàng giỏ hàng
const xoaCartItem = (id) => {
    let viTri = vitriCartList(id, cartList);
    cartList.splice(viTri,1);

    //
    renderCart(cartList);
    setCartList();
    renderProduct(productList);
}
// xoá toàn bộ giỏ hàng
const clearCart = () => {
    cartList = [];
    //
    renderCart(cartList);
    setCartList();
    renderProduct(productList);
}
// chọn thanh toán
const purchase = () => {
    if(cartList.length > 0) {
        document.getElementById('cart-content').style.display = 'none';
        document.getElementById('purchase').style.display = 'flex';
        // render list product trong hoá đơn
        let contentPurchaseItem = cartList.map((item) => {
            return `<div class="purchase-item">
                        <div class="purchase-product-name">
                            <span>${item.quantity}</span> x <span>${item.product.name}</span>
                        </div>
                        <div class="purchase-product-price">
                            $ <span>${item.product.price*item.quantity}</span>
                        </div>
                    </div>`;
        }).join('');
    
        // render ra hoá đơn
        let contentPurchase = `
                        <div class="purchase-list" id="purchase-list-js">
                            ${contentPurchaseItem}
                        </div>
                        <hr>
                        <div class="purchase-total-amount">
                            <p>Payment</p>
                            <div class="total-amount">
                                <p>Total amount to be paid:</p>
                                <p>$ <span id="total-amount-js">${tongTienAll()}</span></p>
                            </div>
                        </div>
                        <div class="purchase-btn">
                            <button onclick="btnOrder()" class="btn-oder">Order now</button>
                            <button onclick="buttonCancel()" class="btn-cancel">Cancel</button>
                        </div>
        `
        document.getElementById('purchase-order').innerHTML = contentPurchase;
        document.getElementById('purchase-order').style.width = '90%';
        document.getElementById('purchase-order').style.height = '90%';
        document.getElementById('purchase-order').style.padding = '4%';
    }
}
// huỷ thanh toán cancel
const buttonCancel = () => {
    document.getElementById('cart-content').style.display = 'flex';
    document.getElementById('purchase').style.display = 'none';
}
// chọn order
const btnOrder = () => {
    let content = `
                    <div class="your-order">
                        <div>
                            <h2>Your order has been placed</h2>
                            <p>Your order-id is : ${Math.floor(Math.random() * 1000)}</p>
                            <p>
                                Your order will be delivered to you 
                                in 3-5 working days
                            </p>
                            <p>
                                You can pay $ ${tongTienAll()} by card or any 
                                online transaction method after the 
                                products have been dilivered to you
                            </p>
                        </div>
                        <button onclick='yourOrderOkay()' class="btnyour-order">okay</button>
                    </div>`
    document.getElementById('purchase-order').innerHTML = content;
    document.getElementById('purchase-order').style.width = '400px';
    document.getElementById('purchase-order').style.height = '500px';
    document.getElementById('purchase-order').style.padding = '3%';

}
const yourOrderOkay = () => {
    let content = `
                    <div class="your-order">
                        <div>
                            <h2><em>Thanks for shopping with us</em></h2>
                        </div>
                        <button onclick='yourOrderThankyou()' class="btnyour-order">Continue</button>
                    </div>`
    document.getElementById('purchase-order').innerHTML = content;
    document.getElementById('purchase-order').style.width = '400px';
    document.getElementById('purchase-order').style.height = '180px';
    document.getElementById('purchase-order').style.padding = '2%';
}
const yourOrderThankyou = () => {
    closeCart();
    clearCart();
    document.getElementById('cart-content').style.display = 'flex';
    document.getElementById('purchase').style.display = 'none';

}
// lọc sản phẩm
const filterProduct = () => {
    let filterSelect = document.getElementById('fliter-select').value;
    let listSamsung = [];
    let listIphone = [];
    productList.forEach(item => {
        if(item.type.toLowerCase() == 'samsung') {
            listSamsung.push(item);
        }
        if(item.type.toLowerCase() == 'iphone') {
            listIphone.push(item);
        }
    })
    if(filterSelect === 'Samsung') {
        renderProduct(listSamsung);
    }
    else if (filterSelect === 'iphone') {
        renderProduct(listIphone);
    }
    else {
        renderProduct(productList);
    }

}


//lưu danh sách vào localStorage
function setCartList() {
    var dataJson = JSON.stringify(cartList);
    localStorage.setItem('LOCAL_CART', dataJson);
}
//lấy danh sách từ localStorage
function getCartList() {
    var dataJson = localStorage.getItem('LOCAL_CART');
    if(dataJson != null){
        cartList = JSON.parse(dataJson);
        renderCart(cartList);
    }
}
// lấy danh sách castList từ local
getCartList();


// favorite product
const like = (el) => {
    el.classList.toggle('color-red')
}
// show cart
const showCart = () => {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.style.display = 'block';
}
// close cart
const closeCart = () => {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.style.display = 'none';
}



document.getElementById('cart-content').addEventListener('click', (even) => {
    even.stopPropagation();
});
document.getElementById('purchase').addEventListener('click', (even) => {
    even.stopPropagation();
});



