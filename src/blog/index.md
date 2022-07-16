title: ?
----

{{ template "pagelist" (((.Site.Pages.Children "blog/").Where "Url" "/$").WhereNot "Draft" "true") }}
