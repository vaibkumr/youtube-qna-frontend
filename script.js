let form = document.querySelector("form");

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
        scrollTop: $(document).height() / 2
    }, 'slow');

}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let url = document.getElementById('text-field').value
    let video_id = youtube_parser(url)
    if (!video_id) {
        alert("Invalid URL")
    } else {
        let url = 'https://vaiku.pythonanywhere.com/video/' + video_id

        $.ajax({
            url: url,
            type: 'GET',
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
                for (let i = 0; i < data.length; i += 2) {
                    qnaList.push({
                        q: data[i],
                        a: data[i + 1]
                    });
                }
                load_data(qnaList)
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
});