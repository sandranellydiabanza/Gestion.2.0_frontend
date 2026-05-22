import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import{ LucideAngularModule,
  Trophy,
  Users,
  UserCheck,
  Calendar,
  Layers,
  Bell,
  User,
  Shield,
  LogOut,
  Activity,

  X
} from 'lucide-angular';
@Component({
  selector: 'app-toast',
  imports: [LucideAngularModule,CommonModule,FormsModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {


  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';

  @Output() close = new EventEmitter<void>();

  private timer: any;

  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;

  ngOnInit(): void {
    this.timer = setTimeout(() => {
      this.onClose();
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}