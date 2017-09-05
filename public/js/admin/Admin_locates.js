$(document).ready(function(){
	
	var url = "/locates";

    $('#selected-country').on('change', function() {
        console.log($('#selected-country').val());
        var img_url = $('#countryImage' + $('#selected-country').val()).val(); 
        var selected = $('#countryName' + $('#selected-country').val()).val();
        console.log(selected);
        $('#country-img').attr('src', img_url);
        var row_count = $('#locates-list tr').length;
        $('.table > tbody  > tr').each(function() {
            $this = $(this)
            var value = $this.find("td.td_country").html();
            console.log(value);
            if (value == selected) {
                $this.show();
            }
            else {
            $this.hide();
            }
        });
    });
    $('.pic-country').on('change', function() {
    var file = this.files[0];
    //if (file.size > 1024) {
    //    alert('max upload size is 1k');
    //}

    });
    $('.upload-pic').on('click', function() {
        console.log("test");
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
                console.log(data);
                $('#locate-img').attr('src', data);
                $('#locate-img-input').val(data);
            },
    });
});
    //display modal form for creating new task
    $('#btn-add-locates').click(function(){
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        var country_name = $('#countryName' + $('#selected-country').val()).val(); 
        $('#country-f').val(country_name);
        $('#myModal').modal('show');
    });

    //display modal form for country editing
    $('.open-modal-locates').click(function(){
        var locate_id = $(this).val();

        $.get(url + '/' + locate_id, function (data) {
            //success data
            console.log(data);
            $('#locate_id').val(data.id);
            $('#locate-form').val(data.locate);
            $("#country-f").val(data.country);
            $('#locate-img').attr('src', data.pic_url);
            $('#locate-img-input').val(data.pic_url);
            $('#btn-save').val("update");
            $(tinymce.get('locate_content').getBody()).html(data.content);
            tinyMCE.triggerSave();
            $('#myModal').modal('show');
        }) 
    });

	//admin program script
	//delete program and remove it from list
    $('.delete-locate').click(function(){
    	$.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        var locate_id = $(this).val();
        console.log(url+'/'+locate_id);
        $.ajax({

            type: "DELETE",
            url: url + '/' + locate_id,
            success: function (data) {
                console.log(data);

                $("#locate" + locate_id).remove();
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
            locate: $('#locate-form').val(),
            country: $("#country-f").val(),
            pic_url: $('#locate-img-input').val(),
            content: $('#locate_content').val(),
        }

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var locate_id = $('#locate_id').val();;
        var my_url = url;

        if (state == "update"){
            type = "PUT"; //for updating existing resource
            my_url += '/' + locate_id;
        }

        console.log(formData);

        $.ajax({

            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                var locate = '<tr id="locate' + data.id + '"><td>' + data.id + '</td><td>' + data.locate + '</td><td>' + "<img style=\"width: 40px;\" src=\"" + data.pic_url + "\" alt=\"\">" + '</td><td>'+  data.country + '</td><td>' + data.created_at + '</td>';
                locate += '<td><button class="btn btn-warning btn-xs btn-detail open-modal-locates" value="' + data.id + '">Edit</button>';
                locate += '<button class="btn btn-danger btn-xs btn-delete delete-locate" value="' + data.id + '">Delete</button></td></tr>';

                if (state == "add"){ //if user added a new record
                    $('#locates-list').append(locate);
                }else{ //if user updated an existing record

                    $("#locate" + locate_id).replaceWith( locate );
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