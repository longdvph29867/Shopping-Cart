
// bật loading
const batLoading = () => {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
}
// tắt loading
const tatLoading = () => {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}


// hiện lại nút buy now
let showBuyNow = (contentItem) => {
    let quantity = contentItem.querySelector('#buy-content-js span').innerText*1;
    if(quantity == 0) {
        contentItem.querySelector('#buy-now-js button').style.display = 'block';
        contentItem.querySelector('#buy-content-js').style.display = 'none';
    }
}
// show quantity in product
const showQuantity = (contentItem) => {
    let btnBuyNow = contentItem.querySelector('.buy-now button');
    let buyQuantity = contentItem.querySelector('.buy-content');
    btnBuyNow.style.display = 'none';
    buyQuantity.style.display = 'flex';
}

//tìm vị trí product trong product list
const vitriProductList = (id, list) => {
    let viTri = list.findIndex(item => item.id == id);
    return viTri;
} 
//tìm vị trí product trong cart list
const vitriCartList = (id, list) => {
    let viTri = list.findIndex(item => item.product.id == id);
    return viTri;
} 

const quantityCartItem = (id, list) => {
    let viTri = list.findIndex(item => item.product.id == id);
    if(viTri != -1) {
        return list[viTri].quantity;
    }
    else {
        return -1;
    }
} 

const tongSoLuongCartItem = (list) => {
    let sum = 0;
    list.forEach(item => {
        sum += item.quantity
    });
    return sum;
}

const tongTienAll = () => {
    let sum = 0;
    let priceCartEls = document.querySelectorAll('#cart-list-js .cart-price span')
    priceCartEls.forEach(item => {
        sum += item.innerText*1;
    })
    return sum;
    
}

const showQuantityProduct = () => {
    let quantitysEl = document.querySelectorAll('#buy-content-js span');
    let btnBuyNows =  document.querySelectorAll('#buy-now-js button');
    let showQuantitys =  document.querySelectorAll('#buy-content-js');
    for(var i = 0; i < quantitysEl.length; i++) {
        let number = quantitysEl[i].innerText*1;
        if(number > 0) {
            btnBuyNows[i].style.display = 'none';
            showQuantitys[i].style.display = 'flex';
        }
    }
}