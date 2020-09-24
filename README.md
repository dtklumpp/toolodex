# Name: Toolodex

Our app is intended to be used as a way to organize and store useful coding resources, tools, solutions in a way that makes it easier for developers to access tried and true methods for recurring problem sets.

## MVP Pitch:

For our MVP version, we plan to include a two-model application, with a one-to-many database structure that stores a user's favorite coding Tools/Resources inside of a variety of Categories or folders that they create. For example, a user can create a Category of CSS, and include within links to their preferred Tools/Resources for solving recurring problems in that aspect of their software development. User will have full CRUD functionality for their Categories and their Tool sets. User will be able to link Tools to Categories, and vice-versa. The first model, Categories, will be fairly simple: a user will be able to essentially create and name a folder in which they want to store their favorite tools and resources. Each user will start with one Category pre-made for them: Favorites. Next, the Tools/Resources model will be more robust, allowing the user to input more information about each tool they are adding to the database, namely: Name, Description, Link, Notes, and a Thumbnail.

## Milestones:

[toolodex milestones](https://trello.com/b/u8NlOYW3/toolodex-milestones)

## Stretch goals:
- Add a keywords field to the the Tools model that will allow a user to search and find their tools more easily.
- Incorporate a search bar that allows a user to find their resources by key words.
- Include a many-to-many relationship between the Categories and the Tools/Resources, such that a user can include a given tool in more than one Category if they choose.
- Add a third model for users, so each user can save their own set of Categories and Tools/Resources.
- Include user authentication - user creates an account with username and password.
- Add in a map page that allows users to see other users and maybe interact with/view their saved resources. Other users would appear on a world map and be clickable to access their data.
- When a user views another user's Tools/Resources or Categories, they should be able to copy them into their own tool set at the click of a button**.
- Add in a feature that allows a user to sort their Tools/Resources as they see fit, moving them up or down in a list (i.e. most commonly used tools can be placed at the top of the list, etc.).
- Add a default set of tools to pre-populate when a user creates an account.
- One of the pre-populated categories will be a Favorites folder, to which a user can choose to add their favorite resources so they can access them easily.
- Add in a "Related Tools" feature that will suggest similar tools, based on key-word connections. For example, if a user is looking at a Math-related tool, the app will suggest any other Math-related tools that are saved in the user's database.
- Add a feature that allows a user to share a resource to another user, who could then accept it (and store it in a category), or reject it.

## Super stretch goals:
- Add in custom model code generator
- Add in an internal metrics dashboard for internal use that shows what kinds of categories/tools our users are creating/using most often.
- Acquire LinkedIn


## User Stories:
1. Welcome Page - serves as a category index page. A user's categories are arranged in an easy to read way, as a grid of tiles. Each category tile is clickable and leads to that category's show page. There will be a nav bar at the top of the page that allows a user to create a new Category, as well as a link to create a new Tool/Resource, and a "Manage Tools" link (which links to a tools index page). Also, in the nav bar will be a clickable "logo" image that will return the user to the homepage. Near the top of the Welcome Page there will be a one-line headline that clues the user in on what to do/how to use the app. For example: "Your favorite tool for organizing your favorite coding resources..." On the welcome page, a user will start with one pre-made category "Favorites" to which they can start adding tools, or elect to create a new category. Next to the Favorites tile, there will be a blank tile with "+" to indicate that the user can click to create a new category, this will link them to a create form for a new category.

2. Add a Category page - Similar nav bar at the top. Page will populate a blank form, asking the user to input basic information to create a Category (which will house the tools they create later). For MVP, the form will have two fields: name (required) and description. At the end of the form, will be a submit button that creates the Category, and then redirects back to the Welcome Page.

3. Category show page - Same nav bar as before, plus an Edit/Delete Category link, and a Home page link. Near the top of the page, a heading that displays the name of the Category. Below, all the tools in this category will be displayed in a grid of tiles, which will show the Tools' names and hopefully a thumbnail/logo of the linked page (which is automatically pulled from a given website). If a user hovers over a Tool tile, a text blurb will appear that gives a short description of the Tool (a description which the user provided when they created the tool). When the user clicks on a Tool tile, the link will open the link in a new tab on the browser. At the bottom of the grid, there will be a blank tile with a "+", indicating to the user that they can create a new tool, which when clicked will take them to Add a Tool page. The delete category button will actually only be available in the Edit form for that category.

4. Edit/Delete Category page - Similar nav bar at the top, include a link to new tools. Page will render a form that comes pre-populated with the selected category's information in various fields. Users can click into an input field and edit/delete text as they like. Towards the bottom of the page, there will be a "Delete Category" button, which when clicked will serve an "Are you sure?" pop-up that the user must accept in order to actually delete the Category. Below the form, will populate a list of that category's Tools, which will each have an edit 
(pencil) and delete (trash bin) button that appears on mouseover, allowing the user to edit a tool (globally), or remove a tool (specifically from the selected category (STRETCH GOAL)). 

5. Add a Tool page - Similar nav bar at the top. Below, a heading that prompts the user to add a Tool. The page will include a form that allows user input to add information about a tool, like: name (required), description, key word(s), notes, and the link (required), checkbox/dropdown menu of which category(ies) they want to add the Tool to. The form will automatically default to adding a new tool to the Favorites category, which the user can always change if/when they add in more categories for themselves.

6. Edit a Tool page -  Similar nav above as above. This page will populate form that is basically identical to the Add a Tool page, but will be pre-populated with the selected tool's information. Included on this page will be a global delete button, which will completely remove the tool from the database (and recursively remove from all categories of which it is a part). If a user clicks the delete button, a pop-up alert will ask the user to confirm that they want to delete the Tool. Upon confirmation, only then will the tool actually be deleted.

7. Tool Index (Manage Tools) Page - Similar nav bar. This age will list all Tools created by the user, regardless of Category. Tools will be listed alphabetically by name. User can click on a tool's name and it will open a new tab in the browser, navigate to that tool's link. To the side of the tool's name will be similar pencil and trash bin buttons that will allow the user to edit or delete a tool. A click on the edit button will redirect to Edit a Tool page, while a click on the delete button will throw an identical alert and ask the user to confirm that they want to delete the tool. Delete on this page will be global, therefore removing the Tool from all Categories to which it belonged.


## Models and Properties:
1. User (Stretch Goal):
    - Name
    - Email
    - Auth Creds
    - "[Categories]"

2. Category:
    - Name
    - Description
    - "[Tools]"

3. Tool:
    - Name
    - Description
    - [Key words]
    - Notes
    - Link
    - "[Category/ies]"




## Technologies used:

## Existing features:

## Planned features (for future versions):


### Concrete ideas for achieving certain features:
    - ** Idea for stealing other people's resources: Include an add button on a resources that redirects a user an "Edit" form, pre-populated with that resource's information, therefore allowing the user to edit/adjust the record before saving it into their own tool set.