// whats in the database: img src link, desc, date, delete and star
// api: get - render back to proper page, render db info on proper page
// post - image, description, date, delete and star onto profile page
// update - star adds to favorites (make a popup?)
// delete posts
// delete user login info from profile page
 let star = document.querySelectorAll('.fa-star');
 let trash = document.querySelectorAll('.fa-trash');

 Array.from(star).forEach(el => {
   el.addEventListener('click', function(){
      const date = this.parentNode.parentNode.childNodes[1].innerText,
      img = this.parentNode.parentNode.childNodes[3].src,
      desc = this.parentNode.parentNode.childNodes[5].textContent;
      console.log(date, img, desc)
     if(this.classList.contains('far')){
       this.classList.remove('far');
       this.classList.add('fas');
       //fetch put req
       fetch('important', {
         method: 'put',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
           'date': date,
           'img': img,
           'desc': desc
         })
       })
       .then(response => {
         if (response.ok) return response.json()
       })
       .then(data => {
         console.log(data)
         // window.location.reload(false)
       })
       this.parentNode.parentNode.style.background = 'yellow';
   }else if(this.classList.contains('fas')){
       this.classList.remove('fas');
       this.classList.add('far');
       //fetch another put req
       fetch('unImportant', {
         method: 'put',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
           'date': date,
           'img': img,
           'desc': desc,
         })
       })
       .then(response => {
         if (response.ok) return response.json()
       })
       .then(data => {
         console.log(data)
         // window.location.reload(false)
       })
       this.parentNode.parentNode.style.background = 'white';
     }
     //if star is empty, change star to filled and run post req, else if star is full change star to empty and run delete req
   })
 })

 Array.from(trash).forEach(function(element) {
       element.addEventListener('click', function(){
         const date = this.parentNode.parentNode.childNodes[1].innerText,
         img = this.parentNode.parentNode.childNodes[3].src,
         desc = this.parentNode.parentNode.childNodes[5].textContent;
         fetch('receipts', {
           method: 'delete',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             'date': date,
             'img': img,
             'desc': desc,
           })
         }).then(function (response) {
           window.location.reload()
         })
       })
 })
