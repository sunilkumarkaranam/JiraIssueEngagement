import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState, ProjectPage } from '@forge/ui';
import api, { route } from '@forge/api'

const fetchNumberOfComments = async function(issuekey) {
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/PLUG-1/comment`);
  const data = await response.json();
  return data.total;
}

const updatefield = async function(issueId, score) {
  const fieldkey = "4eec43f0-1f44-459c-8bc5-71e9c59e3853__DEVELOPMENT__my-field";
  const body = {updates: [
    {
      issueIds: [issueId],
      value: score
    }
  ]};
  const response = await api.asApp().requestJira(route`/rest/api/3/app/${fieldkey}/value`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: Json.stringify(body)
  } );
  console.log(`Response ${response.status} ${response.statusText}`);

}



const EngagementPanel = () => {
 console.log(JSON.stringify(useProductContext));
 const {platformContext: {issuekey}} = useProductContext();
 const[numComments] = useState(fetchNumberOfComments(issuekey));
  return (
    <Fragment>
      <Text>number of comments: {numComments}</Text>
    </Fragment>
  );
};


export const panel = render(
  <IssuePanel>
    <EngagementPanel />
  </IssuePanel>
);

const EngagementOverview = ()=> {
  const {platformContext: {projectkey}} = useProductContext();
  console.log("Project key: " + projectkey);
  return(
    <Fragment>
      <Text>Overview goes here</Text>
    </Fragment>
  )
}

export const engagementOverview = render(
  <ProjectPage>
    <EngagementOverview />
  </ProjectPage>
);
export async function trigger(event, context) {
  console.log("trigger fired");
  console.log(JSON.stringify(event));

  const numComments = await fetchNumberOfComments(event.issue.key);
await updatefield(event.issue.id, numComments)
  console.log("trigger finished");

  
}
