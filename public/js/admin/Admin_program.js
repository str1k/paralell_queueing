$(document).ready(function(){
	
	var url = "/programs";
    $('#locate').on('change', function() {
        console.log("hello");
        console.log($("#locate").val());
    });
    $('#selected-country').on('change', function() {
        console.log($('#selected-country').val());
        var img_url = $('#countryImage' + $('#selected-country').val()).val(); 
        var selected = $('#countryName' + $('#selected-country').val()).val();
        console.log(selected);
        $('#country-img').attr('src', img_url);
        var row_count = $('#program-list tr').length;
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

$('.pdf_upload-but').on('click', function() {
        console.log("test");
    $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
    $.ajax({
        // Your server script to process the upload
        url: '/upload_pdf',
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
                myXhr.upload.addEventListener('progress2', function(e) {
                    if (e.lengthComputable) {
                        $('progress2').attr({
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
                $('#pdf-input').val(data);
            },
    });
});

	//admin program script
	//delete program and remove it from list
    $('.delete-program').click(function(){
    	$.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        var program_id = $(this).val();
        console.log(url+'/'+program_id);
        $.ajax({

            type: "DELETE",
            url: url + '/' + program_id,
            success: function (data) {
                console.log(data);

                $("#program" + program_id).remove();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    $('#country').on('change', function() {
        console.log($('#country').val());
        var selected = $('#country').val();
        
        $('#locate > option').each(function() {
            $this = $(this)
            //var value = $this.find("td.td_country").html();
            console.log(this.text + ' ' + this.value);
            if (this.value.indexOf(selected) >= 0) {
                $('select[name*="locate_list[]"] > option[value="' + this.value +'"]').show();
            }
            else {
            $('select[name*="locate_list[]"] > option[value="' + this.value +'"]').hide();
            }
        });
    });

    //display modal form for country editing
    $('.open-modal-programs').click(function(){
        var locate_id = $(this).val();

        $.get(url + '/' + locate_id, function (data) {
            //success data
            console.log(data.pdf_mode);
            if (data.pdf_mode == 1){
                $('#pdf_mode').attr('checked', true);
            } else{
                $('#pdf_mode').attr('checked', false);
            }
            $('#locate_id').val(data.id);
            $('#locate-form').val(data.name);
            $('#price-form').val(data.starting_price);
            $('#day-count').val(data.day_count);
            $('#night-count').val(data.night_count);
            $(tinymce.get('tour_content').getBody()).html(data.content);
            $("#country-f").val(data.country);           
            $('#locate-img').attr('src', data.tour_pic);
            $('#locate-img-input').val(data.tour_pic);
            $('#pdf-input').val(data.pdf);
            $('#datetimepicker1').find("input").val(data.show_until);
             $('#departure').find("input").val(data.program_start);
             $('#arrival').find("input").val(data.program_end);
            $('#btn-save').val("update");
            tinyMCE.triggerSave();
            $('#myModal').modal('show');
        }) 
    });


    //display modal form for creating new task
    $('#btn-add-programs').click(function(){
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        var country_name = $('#countryName' + $('#selected-country').val()).val(); 
        $('#country-f').val(country_name);
        var selected = $('#countryName' + $('#selected-country').val()).val();


        $('#myModal').modal('show');
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
        var pdf_on = true;
        var pdf_mode = $('#pdf_mode').val();
        console.log(pdf_mode)
         if (pdf_mode == "on"){
            pdf_on = 1;
         }
         else{
            pdf_on = 0;
         }
        var locatearray = $('#locate').val();
        var locatelist = locatearray.join(",");
        var formData = {
            name: $('#locate-form').val(),
            starting_price: $('#price-form').val(),
            day_count: $('#day-count').val(),
            night_count: $('#night-count').val(),
            content: $('#tour_content').val(),
            country: $("#country-f").val(),
            airline_name: $('#airlineName' + $('#select-airline').val()).val(),
            airline_pic: $('#airlineImage' + $('#select-airline').val()).val(),
            tour_pic: $('#locate-img-input').val(),
            pdf: $('#pdf-input').val(),
            pdf_mode: pdf_on,
            show_until: $('#datetimepicker1').find("input").val(),
            locate_list: locatelist,
            program_start: $('#departure').find("input").val(),
            program_end: $('#arrival').find("input").val(),
            description: $('#tour_desc').val(),
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

                var locate = '<tr id="locate' + data.id + '"><td>' + data.id + '</td><td>' + data.name + '</td><td>'+  data.starting_price + '</td><td>'+  data.country + '</td><td>'+  data.show_until + '</td><td>' + data.created_at + '</td>';
                locate += '<td><button class="btn btn-warning btn-xs btn-detail open-modal-locates" value="' + data.id + '">Edit</button>';
                locate += '<button class="btn btn-danger btn-xs btn-delete delete-locate" value="' + data.id + '">Delete</button></td></tr>';

                if (state == "add"){ //if user added a new record
                    $('#program-list').append(locate);
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