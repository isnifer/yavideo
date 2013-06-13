<?php
header('Content-type: application/json');

require_once('vimeo.php');

$key = "09c692cb45364d0f4270aa34f0ebd918f1f6c307";
$secret = "797de4b2c7982ae032cd4ba2bd1a88daca849d2c";

$query = $_GET['q'];
$limit = 48; // number of videos to display for each search

$vimeo = new phpVimeo($key, $secret);
$response = $vimeo->call('vimeo.videos.search', array('per_page' => $limit, 'query' => $query, 'sort' => 'relevant'));

$jarray = array();

foreach($response->videos->video as $v){
	$videoinfo = $vimeo->call('vimeo.videos.getInfo', array('video_id' => $v->id));
	
	$jarray[] = array(
	"thumbnail" => $videoinfo->video[0]->thumbnails->thumbnail[1]->_content,
	"url" => $videoinfo->video[0]->urls->url[0]->_content,
	"title" => $videoinfo->video[0]->title,
	"username" => $videoinfo->video[0]->owner->display_name,
	"userurl" => $videoinfo->video[0]->owner->profileurl,
	"userpic" => $videoinfo->video[0]->owner->portraits->portrait[0]->_content
	);
}

print_r(str_replace('\\/', '/', json_encode($jarray)));
die();

?>