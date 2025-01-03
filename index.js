// console.log("hey lucky !!")

// const state={
//     tasklist:[
//         {
//             title:"",
//             url:"",
//             type:"",
//             description:""
//         },
//         {
//             title:"",
//             url:"",
//             type:"",
//             description:""
//         },
//         {
//             title:"",
//             url:"",
//             type:"",
//             description:""
//         }
//     ]
// }

const state = {
    taskList: []
};

const taskContents=document.querySelector(".task_contents");
const taskModal=document.querySelector(".task_modal_body");

const htmlTaskContents = ({id,title,description,url,type}) => {
    
    const card = document.createElement('div');
    
    card.className = 'col-md-6 col-lg-4 mt-3'
      card.innerHTML = `
        <div class="card shadow-sm task_card">
            <div class="card-header d-flex justify-content-end task_card_header">
                <button type="button" class="btn btn-outline-primary mr-2" name=${id} onclick="editTask.apply(this, arguments)">
                    <i class="fa-solid fa-pencil" name=${id}></i>
                </button>

                <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask.apply(this, arguments)">
                    <i class="fa-solid fa-trash" name=${id}></i>
                </button>
            </div>
            <div class="card-body">
                ${
                    url ? `<img src=${url} alt='card image top' class="card-img-top md-3 rounded"/>` :
                        `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s" alt='card image top' class="card-img-top md-3 rounded"/>`
                }
                <h4 class="task_card_title card-title">${title}</h4>
                <p class="description card-text">${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                <span class="badge text-bg-primary m-1">${type}</span>
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#showtask" id=${id} onclick="openTask.apply(this, arguments)">Open Task</button>
            </div>
        </div>

`;

taskContents.appendChild(card)
document.getElementById('imageurl').value = '';
document.getElementById('taskTitle').value = '';
document.getElementById('taskDescription').value = '';
document.getElementById('tags').value='';

}

const htmlModalContents = ({id,title,description,url,type}) => {
    const date = new date(parseInt(id));
    return `
        <div id=${id}>
            ${
                url ? `<img src=${url} alt='card image top' class="img-fluid rounded"/>` :
                    `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScujirQqIFjN5GuM1565_-DIX6OyU_96HzNBl_BAX8GL0JzMs8&s" alt='card image top' class="img-fluid rounded"/>`
            }
        </div>
        <strong class="text-sm text-muted">Created on: ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="lead">${description}</p>
    `
}

const updateLocalStorage = () => {
    localStorage.setItem("tasks",JSON.stringify(state.taskList))
}

const loadInitialData = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if(tasks) {
            state.taskList = tasks;
            while(taskContents.firstChild){
                taskContents.removeChild(taskContents.firstChild)
               }
    tasks.map(item => {
        return htmlTaskContents(item)
    })
   }
}
  

loadInitialData()

const handleSubmit = (event) => {
    // event.preventDefault()
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('imageurl').value,
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        type: document.getElementById('tags').value,
    };

    if (input.title=="" || input.description=="" || input.type==""){
        return alert("Please Fill The Mandatory Fields...")
    }
    console.log('input',input)
    htmlTaskContents({...input,id})

    state.taskList.push({...input,id});
    updateLocalStorage();
}


const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id}) => id == e.target.id);
    taskModal.innerHTML = htmlModalContents(getTask);
    // console.log("opentask activated");
}



const deleteTask = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
    // console.log(targetId);
    // console.log(type);

    const removeTask = state.taskList.filter(({id})=> id!== targetId)
    // console.log(removeTask)
    state.taskList = removeTask;

    updateLocalStorage()

    if(type === "BUTTON"){
        // console.log(e.target.parentNode.parentNode.parentNode)
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        )
    }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode
  )
}    


const searchTask = (e) => {
       if(!e) e = window.event;

       while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild)
       }

       const resultData = state.taskList.filter(({title})=> title.includes(e.target.value))
       console.log(resultData);

       resultData.map((cardData) => {
         return  htmlTaskContents(cardData)
       })
}

const editTask = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const type = e.target.tagName;
    
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if(type === "BUTTON"){
        parentNode=e.target.parentNode.parentNode;
    }
    else{
        parentNode=e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute ("contenteditable", "true");
    taskType.setAttribute ("contenteditable", "true");

    submitButton.setAttribute('onclick',"saveEdit.apply(this,arguments)")
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes"
}

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetId = e.target.id;
    const parentNode= e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle : taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML
    }

    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task)=>
        task.id === targetId ? {
            ...task,
            id: task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type: updateData.taskType,
            
        } : task
    );

    state.taskList = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute ("contenteditable", "false");
    taskDescription.setAttribute ("contenteditable", "false");
    taskType.setAttribute ("contenteditable", "false");

    
    submitButton.setAttribute('onclick', "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task"
}