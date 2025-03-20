--check nếu là owner thì mới cho tạo project_phase

Giải thích logic chi tiết

1. Tạo Task (createTask)
   Kiểm tra đầu vào: Xác nhận title, project_id, và assigned_to phải có.
   Tạo Task mới:
   Kiểm tra xem project_id hợp lệ và người dùng có quyền tạo task không.
   Kiểm tra assigned_to có tồn tại không.
   Thêm Task mới vào DB.
   Cập nhật thống kê:
   Tăng số lượng Task trong Project (total_tasks).
   Tăng số lượng Task được giao cho User (total_tasks_assigned).
2. Cập nhật trạng thái Task (updateTaskStatus)
   Kiểm tra đầu vào: Xác minh taskId tồn tại, người dùng có quyền cập nhật không.
   Cập nhật trạng thái Task:
   Nếu trạng thái mới là Released, kiểm tra Task có bị trễ deadline không.
   Ghi lại lịch sử trạng thái vào TaskStatusHistory.
   Cập nhật thống kê hiệu suất của User:
   Tăng số lượng tasks_completed nếu Task được phát hành (Released).
   Nếu bị trễ, tăng tasks_completed_late, ngược lại tăng tasks_completed_on_time.
   Tính lại tỷ lệ hoàn thành & thời gian hoàn thành trung bình.
