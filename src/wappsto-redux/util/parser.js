export function parse(json){
  if(!json){
    return [];
  }
  if(json.constructor === Object){
    if(json.meta.type === "idlist"){
      return [];
    }
    if(json.meta.type === "attributelist"){
      json.meta.id = json.path;
      return [json]
    }
  }
  return json;
}
