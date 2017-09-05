
$(document).ready(function(){
    
    var url = "/airlines";
    
    $('.pic-country').on('change', function() {
    var file = this.files[0];
    //if (file.size > 1024) {
    //    alert('max upload size is 1k');
    //}

    console.log("it work");
});
    
    $('.upload-pic').on('click', function() {
    var pic_url = '';
    $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
    $.ajax({
        // Your server script to process the upload
        url: '/upload_image',
        type: 'POST',

        // Form data
        data: new FormData($('form')[0]),

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
        success: function (data) {
                pic_url = data;
                console.log(pic_url);
                $('#country-img').attr('src', pic_url);
                $('#country-img-input').val(pic_url);
            },
    });
});
    //display modal form for creating new task
    $('#btn-add-airlines').click(function(){
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        $('#myModal').modal('show');
    });

    //display modal form for country editing
    $('.open-modal-countries').click(function(){
        var country_id = $(this).val();

        $.get(url + '/' + country_id, function (data) {
            //success data
            console.log(data);
            $('#country_id').val(data.id);
            $('#airline-form').val(data.airline_name);
            $('#country-img').attr('src', data.pic_url);
            $('#country-img-input').val(data.pic_url);
            $('#btn-save').val("update");

            $('#myModal').modal('show');
        }) 
    });

    //admin program script
    //delete program and remove it from list
    $('.delete-country').click(function(){
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        var country_id = $(this).val();
        console.log(url+'/'+country_id);
        $.ajax({

            type: "DELETE",
            url: url + '/' + country_id,
            success: function (data) {
                console.log(data);

                $("#country" + country_id).remove();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    //create new country / update existing country
    $("#btn-save").click(function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })

        e.preventDefault(); 
        console.log($('#airline-form').val());
        console.log($('#country-img-input').val());
        var formData = {
            airline_name: $('#airline-form').val(),
            pic_url: $('#country-img-input').val(),
        }

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var country_id = $('#country_id').val();;
        var my_url = url;

        if (state == "update"){
            type = "PUT"; //for updating existing resource
            my_url += '/' + country_id;
        }

        console.log(formData);

        $.ajax({

            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                var country = '<tr id="country' + data.id + '"><td>' + data.id + '</td><td>' + data.airline_name + '</td><td>' + "<img style=\"width: 40px;\" src=\"" + data.pic_url + "\" alt=\"\">" + '</td><td>' + data.created_at + '</td>';
                country += '<td><button class="btn btn-warning btn-xs btn-detail open-modal-countries" value="' + data.id + '">Edit</button>';
                country += '<button class="btn btn-danger btn-xs btn-delete delete-country" value="' + data.id + '">Delete</button></td></tr>';

                if (state == "add"){ //if user added a new record
                    $('#countries-list').append(country);
                }else{ //if user updated an existing record

                    $("#country" + country_id).replaceWith( country );
                }

                $('#frmTasks').trigger("reset");

                $('#myModal').modal('hide')
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });
});