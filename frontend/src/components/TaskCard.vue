<template>
  <li :class="['task-item', task.status, task.isNew ? 'new-task' : '']">
    <div class="task-header">
      <h3>{{ task.title }} 
        <span v-if="task.isNew" class="new-badge">Nova</span>
        <span v-if="task._id" class="id-badge">ID: {{ task._id.substring(task._id.length - 4) }}</span>
      </h3>
      <div class="priority-badge" :class="task.priority">{{ task.priorityLabel }}</div>
    </div>
    <p class="task-description">{{ task.description }}</p>
    <div class="task-details">
      <span class="status">{{ task.statusLabel }}</span>
      <span v-if="task.dueDate" class="due-date">
        <i class="fa-regular fa-calendar"></i> {{ task.formattedDate }}
      </span>
    </div>
    <div class="task-actions">
      <button @click="$emit('edit', task)" class="btn edit" title="Editar tasca"><i class="fas fa-edit"></i></button>
      <button @click="$emit('complete', task._id)" class="btn complete" :disabled="task.isCompleted()" title="Marcar com completada"><i class="fas fa-check"></i></button>
      <button @click="$emit('delete', task._id)" class="btn delete" title="Eliminar tasca"><i class="fas fa-trash"></i></button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.task-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.task-item:last-child {
  border-bottom: none;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-header h3 {
  margin: 0;
  font-size: 18px;
}

.new-badge {
  background-color: #28a745;
  color: #fff;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 14px;
  margin-left: 10px;
}

.id-badge {
  background-color: #007bff;
  color: #fff;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 14px;
  margin-left: 10px;
}

.priority-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  text-transform: capitalize;
}

.task-item.low .priority-badge {
  background-color: #d1e7dd;
  color: #0f5132;
}

.task-item.medium .priority-badge {
  background-color: #fff3cd;
  color: #856404;
}

.task-item.high .priority-badge {
  background-color: #f8d7da;
  color: #721c24;
}

.task-description {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.task-details {
  font-size: 14px;
  color: #666;
}

.task-details .status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: capitalize;
}

.task-details .due-date {
  display: inline-block;
  margin-left: 10px;
}

.task-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.task-actions .btn {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.btn.edit {
  background-color: #007bff;
  color: #fff;
  margin-right: 5px;
}

.btn.complete {
  background-color: #28a745;
  color: #fff;
  margin-right: 5px;
}

.btn.delete {
  background-color: #dc3545;
  color: #fff;
}

.btn.complete[disabled] {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
