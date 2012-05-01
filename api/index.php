<?php


/**
 * Step 1: Require the Slim PHP 5 Framework
 *
 * If using the default file layout, the `Slim/` directory
 * will already be on your include path. If you move the `Slim/`
 * directory elsewhere, ensure that it is added to your include path
 * or update this file path as needed.
 */
require 'Slim/Slim.php';

/**
 * Step 2: Instantiate the Slim application
 *
 * Here we instantiate the Slim application with its default settings.
 * However, we could also pass a key-value array of settings.
 * Refer to the online documentation for available settings.
 */
$app = new Slim();
$app->add(new Slim_Middleware_ContentTypes());

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function. If you are using PHP < 5.3, the
 * second argument should be any variable that returns `true` for
 * `is_callable()`. An example GET route for PHP < 5.3 is:
 *
 * $app = new Slim();
 * $app->get('/hello/:name', 'myFunction');
 * function myFunction($name) { echo "Hello, $name"; }
 *
 * The routes below work with PHP >= 5.3.
 */

//GET all the children when page loads
$app->get('/children', function () {
    //Get all children from DB
    $sql = "SELECT * FROM child";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);  
        $children = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        //echo json_encode($people);
        echo json_encode($children);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});


//GET all the guardians when page loads
$app->get('/guardian', function () {
    //Get all children from DB
    $sql = "SELECT * FROM guardian";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);  
        $guardians = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        //echo json_encode($people);
        echo json_encode($guardians);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
});


//Basic POST route
$app->post('/checkin', function() use ($app) {
    //$app->add(new Slim_Middleware_ContentTypes());
    $today = date("F j, Y");
    $time = date("g:i a");
    $child = "Child 1";
    $guardian = "Guardian 1";
    //$app->contentType('application/json');
    //Get the Request resource URI
    $body = json_decode($app->request()->getBody());
    $child = $body->child;
    $guardian = $body->guardian;

    $sql = "INSERT INTO attendance (child, guardian_in, date_in, time_in) 
            VALUES (:child, :guardian, :date_in, :time_in)";
        try {
            $db = getConnection();
            $stmt = $db->prepare($sql);  
            $stmt->bindParam("child", $child);
            $stmt->bindParam("guardian", $guardian);
            $stmt->bindParam("date_in", $today);
            $stmt->bindParam("time_in", $time);
            $stmt->execute();
            
        } catch(PDOException $e) {
            error_log($e->getMessage(), 3, '/var/tmp/php.log');
            echo '{"error":{"text":'. $e->getMessage() .'}}'; 
        }    

    echo $child .' has been checked in by '. $guardian;
});

//PUT route
$app->put('/put', function () {
    echo 'This is a PUT route';
});

//DELETE route
$app->delete('/delete', function () {
    echo 'This is a DELETE route';
});

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This is responsible for executing
 * the Slim application using the settings and routes defined above.
 */
$app->run();


function getConnection() {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="";
    $dbname="checkin";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}