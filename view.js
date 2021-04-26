// ---- Define your dialogs  and panels here ----



//
let effective_permissions = define_new_effective_permissions("id_name", add_info_col = true, which_permissions = null);

//function selected_user () { }

let user_select_field = define_new_user_select_field("id_name", "select user", on_user_change = function(selected_user){
    $('#id_name').attr('username', selected_user)
});

var new_dialog = "test";

var new_dialog = define_new_dialog("id_name", "Permissions Dialog");

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 

//add the word "Permissions" behind the lock icon
$('.permbutton').append('View Permissions for this File');

//put effective permissions panel on the page
//$('#sidepanel').append(effective_permissions);

//put user select field on the page
//$('#sidepanel').prepend(user_select_field);


$('.perm_info').click(function(){

    console.log('clicked!')
    new_dialog.dialog('open')
    console.log($('#id_name').attr('filepath'))
    console.log($('#id_name').attr('username'))
    console.log($(this))

})

$('#sidepanel').append('<br><h3>To add a new user and grant complete access:</h3>')
$('#sidepanel').append('<p>- Open the folder you are changing permissions for</p>')
$('#sidepanel').append('<p>- "Add New User"</p>')
$('#sidepanel').append('<p>- Select the user you want to add</p>')
$('#sidepanel').append('<p>- "OK"</p>')
$('#sidepanel').append('<p>- Select the user</p>')
$('#sidepanel').append('<p>- Allow "full_control"</p>')


$('#sidepanel').append('<br><h3>To adjust permissions so that a user can no longer make changes:</h3>')
$('#sidepanel').append('<p>- Open the file you are changing permissions for</p>')
$('#sidepanel').append('<p>- Select the user</p>')
$('#sidepanel').append('<p>- Deny the "write" and "modify" permissions</p>')


$('#sidepanel').append('<br><h3>To deny only the delete permission:</h3>')
$('#sidepanel').append('<p>- Open the folder you are changing permissions for</p>')
$('#sidepanel').append('<p>- "Advanced"</p>')
$('#sidepanel').append('<p>- "Edit..."</p>')
$('#sidepanel').append('<p>- Change the user</p>')
$('#sidepanel').append('<p>- Deny the "delete subfolders and files" and "delete" permissions</p>')

$('#sidepanel').append('<br><h3>To remove a user from the permission settings:</h3>')
$('#sidepanel').append('<p>- Open the file you are changing permissions for</p>')
$('#sidepanel').append('<p>- Select the user you want to remove</p>')
$('#sidepanel').append('<p>- "Remove User"</p>')
$('#sidepanel').append('<p>- If necessary, follow the secuirty message</p>')
$('#sidepanel').append('<p>Hint: deny every permission that the user is allowed</p>')

$('#sidepanel').append('<br><h3><em>Minimize the MTurk banner <img height="15px" src="mturk_arrow.png"> to see more!</em></h3>')


$('#sidepanel').append('<br><h3>To restrict permissions for a group member (ex: employee3 in the employees group):</h3>')
$('#sidepanel').append('<p>- Open the file you are changing permissions for</p>')
$('#sidepanel').append('<p>- "Advanced"</p>')
$('#sidepanel').append('<p>- "Edit"</p>')
$('#sidepanel').append('<p>- Change the user (ex: employee3)</p>')
$('#sidepanel').append('<p>- Deny the permissions you are restricting</p>')
$('#sidepanel').append('<p>Hint: deny "create files/write data" through "delete"</p>')

$('#sidepanel').append('<br><h3>To fix permissions for a teaching assistant:</h3>')
$('#sidepanel').append('<p>A teaching assistant is also a student, so any permissions that are denied for the student user are also denied for the teaching assistant.</p>')
$('#sidepanel').append('<p>- Open the file you are changing permissions for</p>')
$('#sidepanel').append('<p>- "Advanced"</p>')
$('#sidepanel').append('<p>- "Edit..."</p>')
$('#sidepanel').append('<p>- Change the user to "student"</p>')
$('#sidepanel').append('<p>- Remove the check for any permission that is denied</p>')
$('#sidepanel').append('<p>(Dont worry, the student will still only be able to do only what is "allowed")</p>')