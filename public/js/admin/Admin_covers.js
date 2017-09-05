
$(document).ready(function(){
	
	var url = "/covers";
    
    $('.pic-country').on('change', function() {
    var file = this.files[0];
    //if (file.size > 1024) {
    //    alert('max upload size is 1k');
    //}

    console.log("it work");
});
    $('#selected-page').on('change', function() {
        console.log($('#selected-page').val());
        var array = $('#selected-page').val().split(",");
        var img_url = $('#pageImage' + array[0]).val(); 
        var selected = $('#pageName' + array[0]).val();
        console.log(selected);
        $('#page-img').attr('src', img_url);
        $('.table > tbody  > tr').each(function() {
            $this = $(this)
            var value = $this.find("td.td_page").html();
            console.log(value);
            if (value == selected) {
                $this.show();
            }
            else {
            $this.hide();
            }
        });
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
                $('#page-img').attr('src', pic_url);
                $('#page-img-input').val(pic_url);
            },
    });
});
    //display modal form for creating new task
    $('#btn-add-countries').click(function(){
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        var array = $('#selected-page').val().split(",");
        var page_name = $('#pageName' + array[0]).val(); 
        $('#page-f').val(page_name);
        $('#myModal').modal('show');
    });

    //display modal form for country editing
    $('.open-modal-covers').click(function(){
        var cover_id = $(this).val();

        $.get(url + '/' + cover_id, function (data) {
            //success data
            console.log(data);
            $('#page_id').val(data.id);
            $('#page-f').val(data.page);
            $("#href-url").val(data.href_url);
            $("#order").val(data.order);
            $('#page-img').attr('src', data.pic_url);
            $('#page-img-input').val(data.pic_url);
            $('#btn-save').val("update");

            $('#myModal').modal('show');
        }) 
    });

	//admin program script
	//delete program and remove it from list
    $('.delete-cover').click(function(){
    	$.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        var cover_id = $(this).val();
        console.log(url+'/'+cover_id);
        $.ajax({

            type: "DELETE",
            url: url + '/' + cover_id,
            success: function (data) {
                console.log(data);

                $("#page" + cover_id).remove();
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
        var formData = {
            page: $('#page-f').val(),
            href_url: $("#href-url").val(),
            pic_url: $('#page-img-input').val(),
            order: $('#order').val(),
        }

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var page_id = $('#page_id').val();;
        var my_url = url;

        if (state == "update"){
            type = "PUT"; //for updating existing resource
            my_url += '/' + page_id;
        }

        console.log(formData);

        $.ajax({

            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                var cover = '<tr id="page' + data.id + '"><td>' + data.id + '</td><td>' + data.page + '</td><td>' + "<img style=\"width: 40px;\" src=\"" + data.pic_url + "\" alt=\"\">" + '</td><td>' + data.href_url + '</td><td>'+  data.order + '</td><td>' + data.created_at + '</td>';
                cover += '<td><button class="btn btn-warning btn-xs btn-detail open-modal-covers" value="' + data.id + '">Edit</button>';
                cover += '<button class="btn btn-danger btn-xs btn-delete delete-cover" value="' + data.id + '">Delete</button></td></tr>';

                if (state == "add"){ //if user added a new record
                    $('#pages-list').append(cover);
                }else{ //if user updated an existing record

                    $("#page" + page_id).replaceWith( cover );
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