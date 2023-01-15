const form = document.getElementById("ytvideo");
const buttons = form.querySelectorAll("button[type='submit']");
var token = ""

grecaptcha.enterprise.ready(function() {
    grecaptcha.enterprise.execute('6LdK5_sjAAAAAGT1Ka347K3LbhyHdSBbwti1icI7', {action: 'login'}).then(function(tok) {
        token = tok
    });
});

function read_url_populate_form(){
    var urlParams = new URLSearchParams(window.location.search);
    var video_id = urlParams.get('v');
    if(video_id){
        url = window.location.href
        document.getElementById('text-field').value = url.replace("youtubeqna.com","youtube.com")
    }
}

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function load_data(apiData) {
    $('ul').empty()
    var faqList = document.querySelector(".faq-list");
    // var apiData = [
    //   { heading: "FAQ heading 1", text: "FAQ text 1" },
    //   { heading: "FAQ heading 2", text: "FAQ text 2" },
    //   { heading: "FAQ heading 3", text: "FAQ text 3" },
    //   { heading: "FAQ heading 4", text: "FAQ text 4" },
    //   { heading: "FAQ heading 5", text: "FAQ text 5" },
    // ];
    apiData.forEach(function(item) {
        var faqItem = document.createElement("li");
        var faqHeading = document.createElement("h4");
        faqHeading.classList.add("faq-heading");
        faqHeading.innerHTML = item.q;

        var faqText = document.createElement("p");
        faqText.classList.add("read", "faq-text");
        faqText.innerHTML = item.a;

        faqItem.appendChild(faqHeading);
        faqItem.appendChild(faqText);

        faqList.appendChild(faqItem);
    });

    $(".container_no").css({
        display: "flex"
    });

    $('.faq-heading').click(function() {
        $(this).parent('li').toggleClass('the-active').find('.faq-text').slideToggle();
    });

    $('html,body').animate({
        scrollTop: $(document).height() / 3
    }, 'slow');

}

read_url_populate_form()

var summary = function() {
    let url = document.getElementById('text-field').value
    let video_id = youtube_parser(url)
    if (!video_id) {
        alert("Invalid URL")
    } else {
        let url = 'https://vaiku.pythonanywhere.com/video_su' + '?video_id='+video_id+"&token="+token
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            beforeSend: function() {
                // Show the loader
                $('.ajax-loader').css("visibility", "visible");
            },
            success: function(data) {
                // Do something with the data
                console.log(data);
                const qnaList = [];
                qnaList.push({
                    q: "Summary",
                    a: data.join("\n")})
                load_data(qnaList);
                $("h1.h1-qna").hide()
                $("h1.h1-summary").show()                
                $('.faq-heading').parent('li').toggleClass('the-active').find('.faq-text').slideToggle();
            },
            complete: function() {
                // Hide the loader
                $('.ajax-loader').css("visibility", "hidden");
            },
            error: function(error) {
                // Handle any errors that may occur
                console.error(error);
            }
        });
    }
};

var question = function() {
    $('#res_heading h2').contents().first().replaceWith('Generated QnA');
    let url = document.getElementById('text-field').value
    let video_id = youtube_parser(url)
    if (!video_id) {
        alert("Invalid URL")
    } else {
        let url = 'https://vaiku.pythonanywhere.com/video_qa' + '?'+ '?video_id='+video_id+"&token="+token

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            beforeSend: function() {
                // Show the loader
                $('.ajax-loader').css("visibility", "visible");
            },
            success: function(data) {
                console.log(data);
                const qnaList = [];
                for (let i = 0; i < data.length; i += 2) {
                    qnaList.push({
                        q: data[i],
                        a: data[i + 1]
                    });
                }
                load_data(qnaList)
                $("h1.h1-qna").show()
                $("h1.h1-summary").hide()
            },
            complete: function() {
                // Hide the loader
                $('.ajax-loader').css("visibility", "hidden");
            },
            error: function(error) {
                // Handle any errors that may occur
                console.error(error);
            }
        });
    }
};

// buttons.forEach(button => {
//     button.addEventListener("click", e => {
//       // e.target refers to the button that was clicked
//       const clickedButton = e.target;
//       const buttonName = clickedButton.name;
//       console.log(buttonName)
//       e.preventDefault()
//       // do something based on the button that was clicked
//       if (buttonName === "quest") {
//         question()
//       } else if (buttonName === "summ") {
//         console.log("Button 2 was clicked!");
//       } else {
//         alert('Error');
//       }
//     });
// });

buttons.forEach(button => {
    button.addEventListener("click", e => {
      // e.target refers to the button that was clicked
      const clickedButton = e.target;
      const buttonName = clickedButton.name;
      console.log(buttonName)
      e.preventDefault()
      // do something based on the button that was clicked
      if (buttonName === "quest") {
        question()
      } else if (buttonName === "summ") {
        summary();
      } else {
        alert('Error');
      }
    });
});
