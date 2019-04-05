// whats in the database: img src link, desc, date, delete and star
// api: get - render back to proper page, render db info on proper page
// post - image, description, date, delete and star onto profile page
// update - star adds to favorites (make a popup?)
// delete posts
// delete user login info from profile page

//on click of star, change star icon to <i class="fas fa-star"></i>
 let star = document.querySelector('.fa-star');

 Array.from(star).forEach(el => {
   el.addEventListener('click', function(){
     if(star.classList.contains('.far'){
       star.classList.remove('.far');
       star.classList.add('.fas');
       //fetch post req
     }else if(star.classList.contains('.fas')){
       star.classList.remove('.fas');
       star.classList.add('.far');
       //fetch delete req
     }
     //if star is empty, change star to filled and run post req, else if star is full change star to empty and run delete req
   })
 })
