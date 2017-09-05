<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="_token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Main CSS file -->
    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/owl.carousel.css" />
    <link rel="stylesheet" href="css/magnific-popup.css" />
    <link rel="stylesheet" href="css/font-awesome.css" />
    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/responsive.css" />
    <link rel="stylesheet" href="css/bootstrap-datetimepicker.css" type="text/css">
    <!-- Favicon -->
    <link rel="shortcut icon" href="images/icon/favicon.png">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/icon/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="images/icon/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="images/icon/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="images/icon/apple-touch-icon-57-precomposed.png">
    
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <script type="text/javascript" src="docs/js/jquery-2.1.3.min.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/moment-with-locales.js"></script>
    </head>
    <body id="page-top" class="index">

        @include('layouts._header')
        
        
        @yield('content')
        


    <script type="text/javascript" src="js/jquery.parallax.js"></script><!-- Parallax -->
    <script type="text/javascript" src="js/smoothscroll.js"></script><!-- Smooth Scroll -->
    <script type="text/javascript" src="js/masonry.pkgd.min.js"></script><!-- masonry -->
    <script type="text/javascript" src="js/jquery.fitvids.js"></script><!-- fitvids -->
    <script type="text/javascript" src="js/owl.carousel.min.js"></script><!-- Owl-Carousel -->
    <script type="text/javascript" src="js/jquery.counterup.min.js"></script><!-- CounterUp -->
    <script type="text/javascript" src="js/waypoints.min.js"></script><!-- CounterUp -->
    <script type="text/javascript" src="js/jquery.isotope.min.js"></script><!-- isotope -->
    <script type="text/javascript" src="js/jquery.magnific-popup.min.js"></script><!-- magnific-popup -->
    <script type="text/javascript" src="js/scripts.js"></script><!-- Scripts -->


    
    </body>
</html>