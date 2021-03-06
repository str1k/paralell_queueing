
$(document).ready(function(){
	
	var url = "/countries";
    
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
    $('#btn-add-countries').click(function(){
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        $("#region").find('option')
                        .remove()
                        .end()
                        .append($('<option>', {value:"ทัวร์เอเชีย", text:"ทัวร์เอเชีย"}));
        $('#region').append($('<option>', {value:"ทัวร์ยุโรป , อเมริกา , แอฟริกาใต้", text:"ทัวร์ยุโรป , อเมริกา , แอฟริกาใต้"}));
        $('#myModal').modal('show');
    });

    //display modal form for country editing
    $('.open-modal-countries').click(function(){
        var country_id = $(this).val();

        $.get(url + '/' + country_id, function (data) {
            //success data
            console.log(data);
            $('#country_id').val(data.id);
            $('#country-form').val(data.country);
            
            $("#region").find('option')
                        .remove()
                        .end()
                        .append($('<option>', {value:"เอเชีย", text:"เอเชีย"}));
            $('#region').append($('<option>', {value:"ยุโรป", text:"ยุโรป"}));
            $('#region').append($('<option>', {value:"อเมริกา", text:"อเมริกา"}));
            $('#region').append($('<option>', {value:"แอฟริกา", text:"แอฟริกา"}));
            $('#region').append($('<option>', {value:"ออสเตรเลีย", text:"ออสเตรเลีย"}));
            $("#region").val(data.region);
            $('#country-img').attr('src', data.pic_url);
            $('#country-img-input').val(data.pic_url);
            $(tinymce.get('country_content').getBody()).html(data.content);
            tinyMCE.triggerSave();
            console.log($('#country_content').val());
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
        tinyMCE.triggerSave();
        var formData = {
            country: $('#country-form').val(),
            region: $("#region").val(),
            pic_url: $('#country-img-input').val(),
            content: $('#country_content').val(),
        }

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var country_id = $('#country_id').val();
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

                var country = '<tr id="country' + data.id + '"><td>' + data.id + '</td><td>' + data.country + '</td><td>' + "<img style=\"width: 40px;\" src=\"" + data.pic_url + "\" alt=\"\">" + '</td><td>'+  data.region + '</td><td>' + data.created_at + '</td>';
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